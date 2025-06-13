import express from "express";
import { searchGroups } from "../controllers/Group.controller.js";

const groupRouter = express.Router();

groupRouter.get("/searchgroups/:keyword", searchGroups);

export default groupRouter;
