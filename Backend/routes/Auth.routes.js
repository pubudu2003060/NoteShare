import express from "express";
import {
  googleSignin,
  googleSigninCallBack,
  handleGoogleFailure,
  handleGoogleLogin,
  refreshAccessToken,
  signInUser,
  signUpUser,
} from "../controllers/Auth.controller.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/JwtVerify.js";

const auth = express.Router();

auth.post("/signup", signUpUser);

auth.post("/signin", signInUser);

auth.post("/refreshaccesstoken", verifyRefreshToken, refreshAccessToken);

auth.get("/googlesignin", googleSignin);

auth.get("/googlesignin/callback", googleSigninCallBack, handleGoogleLogin);

auth.get("/googlesignin/failure", handleGoogleFailure);

export default auth;
