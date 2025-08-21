import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
      required: true,
      enum: [
        "primaryschool",
        "highschool",
        "undergraduate",
        "postgraduate",
        "other",
      ],
    },
    googleId: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
