import User from "../models/User.model.js";
import Group from "../models/Group.model.js";
import mongoose from "mongoose";
import Note from "../models/Note.model.js";
import bcrypt from "bcryptjs";

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchCriteria = {
      $or: [
        { username: { $regex: query.trim(), $options: "i" } },
        { email: { $regex: query.trim(), $options: "i" } },
      ],
    };

    const users = await User.find(searchCriteria)
      .select("-password")
      .limit(20)
      .lean();

    const formattedUsers = users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
    }));

    res.status(200).json({
      success: true,
      users: formattedUsers,
      message: `Found ${formattedUsers.length} user(s)`,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "Error searching users",
      error: error.message,
    });
  }
};

export const addmembers = async (req, res) => {
  try {
    const { groupId, members = [], editors = [] } = req.body;

    if (members.length === 0 && editors.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one member or editor must be provided",
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const allUserIds = [...members, ...editors];
    const existingUsers = await User.find({ _id: { $in: allUserIds } });

    if (existingUsers.length !== allUserIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more users not found",
      });
    }

    const existingMemberIds = group.members.map((id) => id.toString());
    const existingEditorIds = group.editors.map((id) => id.toString());
    const adminId = group.admin.toString();

    const duplicateMembers = members.filter(
      (id) =>
        existingMemberIds.includes(id) ||
        existingEditorIds.includes(id) ||
        adminId === id
    );

    const duplicateEditors = editors.filter(
      (id) =>
        existingMemberIds.includes(id) ||
        existingEditorIds.includes(id) ||
        adminId === id
    );

    if (duplicateMembers.length > 0 || duplicateEditors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some users are already members or editors of this group",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const group = await Group.findByIdAndUpdate(
        groupId,
        {
          $addToSet: {
            members: { $each: members },
            editors: { $each: editors },
          },
        },
        { session, new: true }
      )
        .populate("editors", "username email")
        .populate("members", "username email");

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: `Successfully added ${members.length} member(s) and ${editors.length} editor(s) to the group`,
        updatedGroupMembers: {
          editors: group.editors,
          members: group.members,
        },
      });
    } catch (transactionError) {
      await session.abortTransaction();
      throw transactionError;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error adding members:", error);
    res.status(500).json({
      success: false,
      message: "Error adding members to group",
      error: error.message,
    });
  }
};

export const upgradeUser = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    const adminUser = req.user;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMember = group.members.includes(userId);
    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of this group or is already an editor",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        {
          $pull: { members: userId },
          $addToSet: { editors: userId },
        },
        { session, new: true }
      )
        .populate("members", "username email")
        .populate("editors", "username email");

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: "User upgraded to editor successfully",
        data: {
          editors: updatedGroup.editors,
          members: updatedGroup.members,
        },
      });
    } catch (transactionError) {
      await session.abortTransaction();
      throw transactionError;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error upgrading user:", error);
    res.status(500).json({
      success: false,
      message: "Error upgrading user",
      error: error.message,
    });
  }
};

export const downgradeUser = async (req, res) => {
  try {
    const { userId, groupId, targetRole } = req.body;
    const adminUser = req.user;

    if (!["member", "none"].includes(targetRole)) {
      return res.status(400).json({
        success: false,
        message: "Can not downgrade",
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isEditor = group.editors.includes(userId);
    const isMember = group.members.includes(userId);

    if (!isEditor && !isMember) {
      return res.status(400).json({
        success: false,
        message: "User is not a editor or member of this group",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let groupUpdateQuery = {};

      if (targetRole === "member") {
        if (!isEditor) {
          return res.status(400).json({
            success: false,
            message: "User is not an editor",
          });
        }

        groupUpdateQuery = {
          $pull: { editors: userId },
          $addToSet: { members: userId },
        };
      } else if (targetRole === "none") {
        if (isEditor) {
          groupUpdateQuery = { $pull: { editors: userId } };
        } else if (isMember) {
          groupUpdateQuery = { $pull: { members: userId } };
        }
      }

      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        groupUpdateQuery,
        { session, new: true }
      )
        .populate("members", "username email")
        .populate("editors", "username email");

      await session.commitTransaction();

      const message =
        targetRole === "member"
          ? "User downgraded to member successfully"
          : "User removed from group successfully";

      res.status(200).json({
        success: true,
        message,
        data: {
          editors: updatedGroup.editors,
          members: updatedGroup.members,
        },
      });
    } catch (transactionError) {
      await session.abortTransaction();
      throw transactionError;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error downgrading user:", error);
    res.status(500).json({
      success: false,
      message: "Error downgrading user",
      error: error.message,
    });
  }
};

export const addToTheGroup = async (req, res) => {
  try {
    const user = req.user;
    const groupId = req.body.groupId;

    const group = await Group.findById(groupId)
      .populate("admin")
      .populate("editors")
      .populate("members");

    if (!group) {
      res.status(404).json({ success: false, message: "Group not found" });
    }

    const isAdmin = group.admin._id.equals(user._id);
    const isEditor = group.editors.some((editor) =>
      editor._id.equals(user._id)
    );
    const isMember = group.members.some((member) =>
      member._id.equals(user._id)
    );

    if (isAdmin || isEditor || isMember) {
      res
        .status(500)
        .json({ success: false, message: "User is already in this group" });
    }

    if (group.isPrivate) {
      return res.status(200).json({
        success: false,
        message: "This is a private group.Wait admin aprove your request",
      });
    }

    group.members.push(user._id);
    await group.save();

    return res.status(200).json({
      success: true,
      message: "User added to group successfully",
    });
  } catch (error) {
    console.error("Add to group error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password").lean();

    const usersGroups = await Group.find({
      $or: [{ members: user._id }, { editors: user._id }, { admin: user._id }],
    });

    const groupCount = usersGroups.length;

    const usersNotes = await Note.find({ createdBy: user._id });

    const noteCount = usersNotes.length;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userProfile = {
      username: user.username,
      email: user.email,
      age: user.age,
      grade: user.grade,
      createdAt: user.createdAt,
      groupCount,
      noteCount,
    };

    res.status(200).json({
      success: true,
      user: userProfile,
      message: "Profile retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, age, grade } = req.body;

    if (age < 1 || age > 120) {
      return res.status(400).json({
        success: false,
        message: "Age must be between 1 and 120",
      });
    }

    const validGrades = [
      "primaryschool",
      "highschool",
      "undergraduate",
      "postgraduate",
      "other",
    ];

    if (!validGrades.includes(grade)) {
      return res.status(400).json({
        success: false,
        message: "Invalid grade value",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          username: username.trim(),
          age: parseInt(age),
          grade,
        },
        {
          session,
          new: true,
          runValidators: true,
        }
      ).select("-password");

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        user: {
          username: updatedUser.username,

          age: updatedUser.age,
          grade: updatedUser.grade,
        },
        message: "Profile updated successfully",
      });
    } catch (transactionError) {
      await session.abortTransaction();
      throw transactionError;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error updating user profile:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and newpassword cant be the same one",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await User.findByIdAndUpdate(
        userId,
        { password: hashedNewPassword },
        { session }
      );

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (transactionError) {
      await session.abortTransaction();
      throw transactionError;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};
