import Note from "../models/Note.model.js";

export const createNotes = async (req, res) => {
  try {
    console.log("eee");
    const { name, description, tags, group } = req.body;
    const userId = req.user._id;

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one file is required",
      });
    }

    // Process uploaded files
    const uploadedContent = req.files.map((file) => {
      const fileType = file.mimetype.split("/")[0];
      return {
        type: fileType,
        url: file.path,
      };
    });

    // Parse tags if it's a string (from FormData)
    let parsedTags;
    try {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid tags format",
      });
    }

    // Validate required fields
    if (!parsedTags || parsedTags.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one tag is required",
      });
    }

    const note = new Note({
      name,
      description,
      tags: parsedTags,
      group,
      createdBy: userId,
      content: uploadedContent,
    });

    await note.save();

    res
      .status(201)
      .json({ success: true, message: "New note added successfully.", note });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getNotesbyGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user._id;

    const notes = await Note.find({ group: groupId }).populate(
      "createdBy",
      "username email"
    );

    if (!notes || notes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No notes found for this group" });
    }

    res.status(200).json({
      success: true,
      message: "Note Load Successfully for the group",
      notes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching notes" });
  }
};
