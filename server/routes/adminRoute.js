import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import upload from "../middleware/upload.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import { validateUsername, validateEmail, validatePassword } from "../utils/validators.js"

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // storing refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      accessToken,
      username: user.username,
      email: user.email
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/refresh", (req, res) => {

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {

      if (err)
        return res.status(403).json({ message: "Invalid refresh token" });

      const newAccessToken = generateAccessToken(user);

      res.json({ accessToken: newAccessToken });
    }
  );
});


// Getting all users
router.get("/users", adminMiddleware, async (req, res) => {
  try {

    const users = await User.find({ isAdmin: { $ne: true } }).select("-password");

    console.log("USERS FROM API: ", users);

    res.status(200).json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//Add user
router.post("/users", adminMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const usernameError = validateUsername(username);
if (usernameError) {
  return res.status(400).json({ message: usernameError });
}

const emailError = validateEmail(email);
if (emailError) {
  return res.status(400).json({ message: emailError });
}

const passwordError = validatePassword(password);
if (passwordError) {
  return res.status(400).json({ message: passwordError });
}

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePic: req.file?.filename || "",
      isAdmin: false
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully"
    });

  } catch (err) {

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      message: "Something went wrong"
    });
  }
});


//Update user
router.put("/users/:id", adminMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;

    const existingUser = await User.findOne({ email });

    const usernameError = validateUsername(username);
    if (usernameError) {
      return res.status(400).json({ message: usernameError });
    }

    const emailError = validateEmail(email);
    if (emailError) {
      return res.status(400).json({ message: emailError });
    }

    if (existingUser && existingUser._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "User already exists" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);

  } catch (err) {

    if (err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
});


//Delete user
router.delete("/users/:id", adminMiddleware, async (req, res) => {
  try {

      const deletedUser = await User.findOneAndDelete({
          _id: req.params.id,
          isAdmin: { $ne: true }
      });


    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;