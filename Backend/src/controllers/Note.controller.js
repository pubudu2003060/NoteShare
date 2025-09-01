import { deleteCloudinaryItems } from "../middleware/DeleteClaudnaryFiles.js";
import Note from "../models/Note.model.js";

export const createNotes = async (req, res) => {
  try {
    const { name, description, tags, group } = req.body;
    const userId = req.user._id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one file is required",
      });
    }

    const uploadedContent = req.files.map((file) => {
      const fileType = file.mimetype.split("/")[0];
      return {
        publicId: file.filename,
        type: fileType,
        url: file.path,
      };
    });

    let parsedTags;
    try {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid tags format",
      });
    }

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

    const savedNote = await note.save();
    await savedNote.populate("createdBy", "username email");

    res.status(201).json({
      success: true,
      message: "New note added successfully.",
      note: {
        id: savedNote._id,
        name: savedNote.name,
        description: savedNote.description,
        tags: savedNote.tags,
        group: savedNote.group,
        content: savedNote.content,
        createdBy: savedNote.createdBy,
      },
    });
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

    const sendNotes = notes.map((note) => ({
      id: note._id,
      name: note.name,
      description: note.description,
      tags: note.tags,
      group: note.group,
      content: note.content,
      createdBy: note.createdBy,
    }));

    res.status(200).json({
      success: true,
      message: "Note Load Successfully for the group",
      notes: sendNotes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching notes" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const noteId = req.body.noteId;

    if (!noteId) {
      return res
        .status(400)
        .json({ success: false, message: "noteId is required" });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    await Note.findByIdAndDelete(noteId);

    if (note.content && note.content.length > 0) {
      await Promise.all(
        note.content.map((item) => deleteCloudinaryItems(item.publicId))
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Note deleted", noteId: noteId });
  } catch (error) {
    console.log("Note delete error: " + error.message);
    res.status(500).json({ success: false, message: "Note delete error" });
  }
};
