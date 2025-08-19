import Group from "../models/Group.model.js";
import Note from "../models/Note.model.js";

export const GroupAdminEditorAuth = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const groupId = req.body.groupId;

    if (!groupId) {
      return res
        .status(400)
        .json({ success: false, message: "Group ID is required" });
    }

    const group = await Group.findOne({ _id: groupId })
      .populate("admin", "_id name email")
      .populate("editors", "_id name email");

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    const isAdmin = group.admin._id.equals(userId);
    const isEditor = group.editors.some((editor) => editor._id.equals(userId));

    if (!isAdmin && !isEditor) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have admin or editor access to perform this action",
      });
    }

    next();
  } catch (error) {
    console.error("Error in GroupAdminEditorAuth middleware:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during group access check",
    });
  }
};

export const GroupAdminAuth = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const groupId = req.body.groupId;

    if (!groupId) {
      return res
        .status(400)
        .json({ success: false, message: "Group ID is required" });
    }

    const group = await Group.findOne({ _id: groupId }).populate(
      "admin",
      "_id name email"
    );

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    const isAdmin = group.admin._id.equals(userId);

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have admin or editor access to perform this action",
      });
    }

    next();
  } catch (error) {
    console.error("Error in GroupAdminAuth middleware:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during group access check",
    });
  }
};

export const deleteNoteAuth = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const groupId = req.body.groupId;
    const noteId = req.body.noteId;

    if (!groupId) {
      return res
        .status(400)
        .json({ success: false, message: "Group ID is required" });
    }

    const group = await Group.findOne({ _id: groupId })
      .populate("admin", "_id name email")
      .populate("editors", "_id name email");

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    const note = await Note.findById(noteId);

    console.log(note);

    const isAdmin = group.admin._id.equals(userId);
    const isEditor = group.editors.some((editor) => editor._id.equals(userId));
    const isCreater = note.createdBy.equals(userId);

    if (!isAdmin && !isEditor && !isCreater) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have admin or editor or creater access to perform this action",
      });
    }

    next();
  } catch (error) {
    console.error("Error in deletenoteauth middleware:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during group access check",
    });
  }
};
