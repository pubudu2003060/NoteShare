import express from "express";
import {
  addUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/User.controller.js";

const userRouter = express.Router();

userRouter.post("/adduser", addUser);

userRouter.get("/getusers", getUsers);

userRouter.get("/getuser/:id", getUserById);

userRouter.put("/updateuser/:id", updateUser);

userRouter.delete("/deleteuser/:id", deleteUser);

export default userRouter;
