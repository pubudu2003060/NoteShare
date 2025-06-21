import express from "express";
import {
  createNotes,
  getNotesbyGroup,
} from "../controllers/Note.controller.js";
import { verifyAccessToken } from "../middleware/JwtVerify.js";
import upload from "../config/multer.js";

const noteRouter = express.Router();

noteRouter.post(
  "/createnotes",
  verifyAccessToken,
  upload.array("files", 10),
  createNotes
);

noteRouter.post("/getnotesbygroup", verifyAccessToken, getNotesbyGroup);

export default noteRouter;
