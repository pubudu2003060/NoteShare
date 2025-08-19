import express from "express";
import {
  searchUsers,
  addmembers,
  upgradeUser,
  downgradeUser,
  addToTheGroup,
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/User.controller.js";
import { verifyAccessToken } from "../middleware/JwtVerify.js";
import { GroupAdminEditorAuth } from "../middleware/GroupAuth.js";

const userRouter = express.Router();

userRouter.post(
  "/searchUsers",
  verifyAccessToken,
  GroupAdminEditorAuth,
  searchUsers
);

userRouter.post(
  "/addmembers",
  verifyAccessToken,
  GroupAdminEditorAuth,
  addmembers
);

userRouter.post(
  "/upgradeuser",
  verifyAccessToken,
  GroupAdminEditorAuth,
  upgradeUser
);

userRouter.post(
  "/downgradeuser",
  verifyAccessToken,
  GroupAdminEditorAuth,
  downgradeUser
);

userRouter.post("/addtothegroup", verifyAccessToken, addToTheGroup);

userRouter.get("/profile", verifyAccessToken, getUserProfile);

// Update user profile
userRouter.put("/profile", verifyAccessToken, updateUserProfile);

// Change password
userRouter.put("/change-password", verifyAccessToken, changePassword);

export default userRouter;
