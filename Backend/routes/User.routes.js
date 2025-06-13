import express from "express";
import {
  refreshAccessToken,
  signInUser,
  signUpUser,
  test,
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

export default userRouter;
