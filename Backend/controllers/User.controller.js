import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUpUser = async (req, res) => {
  try {
    const { username, email, password, age, grade } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      age,
      grade,
    });

    const token = jwt.sign({ id: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await newUser.save();
    console.log("User created:", newUser);
    res.status(201).json({
      success: true,
      token,
      message: "User SignUp Successfully",
      newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Error creating user" });
  }
};

export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      user,
      token,
      message: "User SignIn Successfully",
    });
  } catch (error) {
    console.error("Error signing in user:", error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};
