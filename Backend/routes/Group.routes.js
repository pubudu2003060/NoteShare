import express from "express";
import {
  createGroup,
  getAdminGroupfromId,
  getMyGroups,
  searchGroups,
} from "../controllers/Group.controller.js";
import { verifyAccessToken } from "../middleware/JwtVerify.js";
import { upload } from "../config/multer.js";

const groupRouter = express.Router();

groupRouter.get("/searchgroups", verifyAccessToken, searchGroups);

groupRouter.post("/getmygroups", verifyAccessToken, getMyGroups);

groupRouter.get("/getadmingroupfromid", verifyAccessToken, getAdminGroupfromId);

groupRouter.post(
  "/creategroup",
  verifyAccessToken,
  upload.single("photo"),
  createGroup
);

export default groupRouter;
