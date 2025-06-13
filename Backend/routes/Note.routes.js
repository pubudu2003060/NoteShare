import express from "express";
import { getRandomTenNotes } from "../controllers/Note.controller.js";

const noteRouter = express.Router();

noteRouter.get("/getrandomtennotes", getRandomTenNotes);

export default noteRouter;
