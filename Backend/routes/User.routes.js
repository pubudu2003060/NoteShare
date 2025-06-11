import express from "express";
import { signInUser, signUpUser } from "../controllers/User.controller.js";
import { verifyToken } from "../middleware/JwtVerify.js";

const userRouter = express.Router();

userRouter.post("/signup", signUpUser);

userRouter.post("/signin", signInUser);

userRouter.get("/test", verifyToken, (req, res) => {
  res.status(200).json({ message: "Test route is working" });
});

export default userRouter;
