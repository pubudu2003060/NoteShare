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
} from "../controllers/User.controller.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/JwtVerify.js";

const userRouter = express.Router();

userRouter.post("/signup", signUpUser);

userRouter.post("/signin", signInUser);

userRouter.post("/refreshaccesstoken", verifyRefreshToken, refreshAccessToken);

userRouter.get("/test", verifyAccessToken, test);

userRouter.get("/searchUsers", verifyAccessToken, searchUsers);

userRouter.post("/addmembers", verifyAccessToken, addmembers);

userRouter.post("/upgradeuser", verifyAccessToken, upgradeUser);

userRouter.post("/downgradeuser", verifyAccessToken, downgradeUser);

export default userRouter;
