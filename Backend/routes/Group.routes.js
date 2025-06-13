import express from "express";
import { searchGroups } from "../controllers/Group.controller.js";
import { verifyAccessToken } from "../middleware/JwtVerify.js";

const groupRouter = express.Router();

groupRouter.get("/searchgroups", verifyAccessToken, searchGroups);

export default groupRouter;
