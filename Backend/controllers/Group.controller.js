import Group from "../models/Group.model.js";
import User from "../models/User.model.js";

export const searchGroups = async (req, res) => {
  const { keyword } = req.query;

  try {
    let groups;

    if (keyword.trim() === "") {
      groups = await Group.aggregate([{ $sample: { size: 20 } }]);
    } else {
      groups = await Group.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { tags: { $regex: keyword, $options: "i" } },
        ],
      }).populate("members", "_id");
    }

    const formattedGroups = groups.map((group) => ({
      id: group._id,
      name: group.name,
      photo: group.photo,
      description: group.description,
      tags: group.tags,
      type: "group",
      isPrivate: group.isPrivate,
      members: group.members?.length || 0,
    }));

    res.status(200).json({
      success: true,
      message:
        keyword.trim() != ""
          ? "Groups matching your search"
          : "Random 20 groups",
      groups: formattedGroups,
    });
  } catch (error) {
    console.error("Error fetching groups:", error.message);
    res.status(500).json({
      success: false,
      message: "Error while fetching groups",
    });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ admin: userId }).sort({ createdAt: -1 });

    const formattedGroups = groups.map((group) => ({
      id: group._id,
      name: group.name,
      photo: group.photo,
      description: group.description,
      tags: group.tags,
      isPrivate: group.isPrivate,
      members: group.members?.length + group.editors?.length || 0,
    }));

    res.status(200).json({
      success: true,
      message: "Groups retrieved successfully",
      data: formattedGroups,
    });
  } catch (error) {
    console.error("Error fetching user's groups:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch groups",
    });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { name, description, tags, isPrivate } = req.body;
    const userId = req.user._id;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newGroup = new Group({
      name: name.trim(),
      photo: req.file.path,
      description: description.trim(),
      tags: JSON.parse(tags) || [],
      isPrivate: isPrivate || false,
      admin: userId,
      members: [],
      editors: [],
    });

    const savedGroup = await newGroup.save();

    const populatedGroup = await Group.findById(savedGroup._id);

    const formattedGroup = {
      id: populatedGroup._id,
      name: populatedGroup.name,
      photo: populatedGroup.photo,
      description: populatedGroup.description,
      tags: populatedGroup.tags,
      isPrivate: populatedGroup.isPrivate,
      members:
        populatedGroup.members?.length + populatedGroup.editore?.length || 0,
    };

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: formattedGroup,
    });
  } catch (error) {
    console.error("Error creating group:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create group",
      error: error.message,
    });
  }
};

export const getGroupfromId = async (req, res) => {
  const groupId = req.query.id;
  const userId = req.user._id;

  let accesslevel = "none";

  try {
    const group = await Group.findById(groupId)
      .populate("admin", "username email  ")
      .populate("editors", "username email")
      .populate("members", "username email");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (group.admin._id.equals(userId)) {
      accesslevel = "admin";
    } else if (group.members.includes(userId)) {
      accesslevel = "member";
    } else if (group.editors.includes(userId)) {
      accesslevel = "editor";
    }

    res.status(200).json({
      success: true,
      message: "Group data with admin and notes",
      group: {
        id: group._id,
        name: group.name,
        photo: group.photo,
        description: group.description,
        tags: group.tags,
        isPrivate: group.isPrivate,
        admin: group.admin,
        editors: group.editors,
        members: group.members,
        accesslevel: accesslevel,
      },
    });
  } catch (error) {
    console.log("Error fetching group data: " + error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching group data",
    });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const updatedGroupData = req.body;
    const file = req.file;

    const group = await Group.findById(updatedGroupData.groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    const updateFields = {};

    if (updatedGroupData.name) updateFields.name = updatedGroupData.name;
    if (updatedGroupData.description)
      updateFields.description = updatedGroupData.description;
    if (updatedGroupData.isPrivate) {
      updateFields.isPrivate =
        updatedGroupData.isPrivate === "true" ||
        updatedGroupData.isPrivate === true;
    }
    if (updatedGroupData.tags) {
      console.log(updatedGroupData.tags);
      updateFields.tags = JSON.parse(updatedGroupData.tags);
    }

    if (file) {
      updateFields.photo = file.path;
    }

    await Group.updateOne(
      { _id: updatedGroupData.groupId },
      { $set: updateFields }
    );

    return res.status(200).json({
      success: true,
      updatedGroup: updateFields,
      message: "Group updated successfully",
    });
  } catch (error) {
    console.error("Error updating group:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
