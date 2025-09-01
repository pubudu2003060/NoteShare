import express from "express";
import {
  createNotes,
  deleteNote,
  getNotesbyGroup,
} from "../controllers/Note.controller.js";
import { verifyAccessToken } from "../middleware/JwtVerify.js";
import upload from "../config/multer.js";
import { deleteNoteAuth } from "../middleware/GroupAuth.js";

const noteRouter = express.Router();

noteRouter.post(
  "/createnotes",
  verifyAccessToken,
  upload.array("files", 10),
  createNotes
);

noteRouter.post("/getnotesbygroup", verifyAccessToken, getNotesbyGroup);

noteRouter.delete("/deletenote", verifyAccessToken, deleteNoteAuth, deleteNote);

export default noteRouter;
