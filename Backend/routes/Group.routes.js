import express from "express";
import {
  createGroup,
  deleteGroup,
  getGroupfromId,
  getMyGroups,
  searchGroups,
  updateGroup,
} from "../controllers/Group.controller.js";
import { verifyAccessToken } from "../middleware/JwtVerify.js";
import upload from "../config/multer.js";
import { GroupAdminAuth } from "../middleware/GroupAuth.js";

const groupRouter = express.Router();

groupRouter.get("/searchgroups", verifyAccessToken, searchGroups);

groupRouter.post("/getmygroups", verifyAccessToken, getMyGroups);

groupRouter.get("/getgroupfromid", verifyAccessToken, getGroupfromId);

groupRouter.post(
  "/creategroup",
  verifyAccessToken,
  upload.single("photo"),
  createGroup
);

groupRouter.put(
  "/updategroup",
  verifyAccessToken,
  upload.single("photo"),
  GroupAdminAuth,
  updateGroup
);

groupRouter.delete(
  "/deletegroup",
  verifyAccessToken,
  GroupAdminAuth,
  deleteGroup
);

export default groupRouter;
