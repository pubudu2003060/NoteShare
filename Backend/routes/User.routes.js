import express from "express";
import { signInUser, signUpUser } from "../controllers/User.controller.js";
import { verifyToken } from "../middleware/JwtVerify.js";

const userRouter = express.Router();

userRouter.post("/signup", signUpUser);

userRouter.post("/signin", signInUser);

export default userRouter;
