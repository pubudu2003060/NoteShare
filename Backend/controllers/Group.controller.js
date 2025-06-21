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
      image: group.photo,
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
    const userId = req.body.id;

    const groups = await Group.find({ admin: userId })
      .populate("admin", "name email")
      .populate("members", "name email")
      .populate("editors", "name email")
      .sort({ createdAt: -1 });

    const formattedGroups = groups.map((group) => ({
      id: group._id,
      name: group.name,
      image: group.photo,
      description: group.description,
      tags: group.tags,
      type: "group",
      isPrivate: group.isPrivate,
      members: group.members?.length || 0,
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
    const { userId, name, description, tags, isPrivate } = req.body;

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

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { adminGroups: savedGroup._id },
      },
      { new: true }
    );

    // await Promise.all([
    //   newGroup.save(),
    //   User.findByIdAndUpdate(userId, {
    //     $addToSet: { adminGroups: newGroup._id },
    //   }),
    // ]);

    const populatedGroup = await Group.findById(savedGroup._id)
      .populate("admin", "name email")
      .populate("members", "name email")
      .populate("editors", "name email");

    const formattedGroup = {
      id: populatedGroup._id,
      name: populatedGroup.name,
      photo: populatedGroup.photo,
      description: populatedGroup.description,
      tags: populatedGroup.tags,
      isPrivate: populatedGroup.isPrivate,
    };

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: formattedGroup,
    });
  } catch (error) {
    console.error("Error creating group:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A group with this name already exists",
      });
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create group",
      error: error.message,
    });
  }
};

export const getGroupfromId = async (req, res) => {
  const groupId = req.query.id;
  const user = req.user;

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

    if (user.adminGroups.includes(groupId)) {
      accesslevel = "admin";
    } else if (user.memberGroups.includes(groupId)) {
      accesslevel = "member";
    } else if (user.editorGroups.includes(groupId)) {
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

export const updateGroup = async () => {
  const groupId = req.path.groupid;
  console.log(groupId);
  try {
  } catch (error) {}
};
