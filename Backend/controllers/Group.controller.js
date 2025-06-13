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

    let photoUrl = req.file ? req.file.path : null;

    if (!photoUrl) {
      photoUrl =
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop";
    }

    const newGroup = new Group({
      name: name.trim(),
      photo: photoUrl,
      description: description.trim(),
      tags: tags || [],
      isPrivate: isPrivate || false,
      admin: userId,
      members: [],
      editors: [],
    });

    const savedGroup = await newGroup.save();

    const populatedGroup = await Group.findById(savedGroup._id)
      .populate("admin", "name email")
      .populate("members", "name email")
      .populate("editors", "name email");

    // Format response
    const formattedGroup = {
      id: populatedGroup._id,
      name: populatedGroup.name,
      photo: populatedGroup.photo,
      description: populatedGroup.description,
      tags: populatedGroup.tags,
      isPrivate: populatedGroup.isPrivate,
      admin: populatedGroup.admin,
      members: populatedGroup.members.length,
      editors: populatedGroup.editors,
      createdAt: populatedGroup.createdAt,
      updatedAt: populatedGroup.updatedAt,
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
