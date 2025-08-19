import express from "express";
import {
  refreshAccessToken,
  signInUser,
  signUpUser,
  test,
} from "../controllers/Auth.controller.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/JwtVerify.js";

const auth = express.Router();

auth.post("/signup", signUpUser);

auth.post("/signin", signInUser);

auth.post("/refreshaccesstoken", verifyRefreshToken, refreshAccessToken);

auth.get("/test", verifyAccessToken, test);

export default auth;
