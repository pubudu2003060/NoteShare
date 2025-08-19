import User from "../models/User.model.js";
import Group from "../models/Group.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const signUpUser = async (req, res) => {
  try {
    const { username, email, password, age, grade } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      age,
      grade,
    });

    await newUser.save();

    const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log("User created:", newUser);
    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      message: "User SignUp Successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        age: newUser.age,
        grade: newUser.grade,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Error creating user" });
  }
};

export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        grade: user.grade,
      },
      accessToken,
      refreshToken,
      message: "User SignIn Successfully",
    });
  } catch (error) {
    console.error("Error signing in user:", error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

export const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

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

export const test = (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const id = req.params.id;
    if (userId == id) {
      res.status(400).json({ success: fail, message: "try fail" });
    }
    const sendUser = {
      id: userId,
      username: user.username,
      email: user.email,
      age: user.age,
      grade: user.grade,
    };
    res
      .status(200)
      .json({ success: true, message: "try pass", user: sendUser });
  } catch (error) {
    console.log("test error " + error.message);
    res.status(400).json({ success: fail, message: "try fail" });
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
