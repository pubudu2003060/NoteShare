import express from "express";
import { searchGroups } from "../controllers/Group.controller.js";
import { verifyToken } from "../middleware/JwtVerify.js";

const groupRouter = express.Router();

groupRouter.get("/searchgroups", verifyToken, searchGroups);

export default groupRouter;
