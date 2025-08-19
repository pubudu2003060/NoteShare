import express from "express";
import {
  refreshAccessToken,
  signInUser,
  signUpUser,
  test,
  searchUsers,
  addmembers,
  upgradeUser,
  downgradeUser,
  addToTheGroup,
} from "../controllers/User.controller.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/JwtVerify.js";
import { GroupAdminEditorAuth } from "../middleware/GroupAuth.js";

const userRouter = express.Router();

userRouter.post("/signup", signUpUser);

userRouter.post("/signin", signInUser);

userRouter.post("/refreshaccesstoken", verifyRefreshToken, refreshAccessToken);

userRouter.get("/test", verifyAccessToken, test);

userRouter.get("/searchUsers", verifyAccessToken, searchUsers);

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

export default userRouter;
