import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import upload from "../middleware/upload.js"
import authMiddleware from "../middleware/authMiddleware.js"
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

const router = express.Router()

//signup
router.post("/signup", upload.single("profilePic"), async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic: req.file ? req.file.filename : ""
    });

    //
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      accessToken,
      username: user.username,
      profilePic: user.profilePic,
      email: user.email
    });


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // storing the refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      accessToken,
      username: user.username,
      profilePic: user.profilePic,
      email: user.email
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/refresh", (req, res) => {

  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });

  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});



router.put(
  "/update-user",
  authMiddleware,
  upload.single("profilePic"), async (req, res) => {
  try {

    const { id } = req.user;

    const { username, email, password } = req.body;

    let updatedData = {
      username,
      email
    };

    // If password entered → hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    // If new image uploaded
    if (req.file) {
      updatedData.profilePic = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.json({
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic
    });

  } catch (error) {
  console.log("UPDATE USER ERROR:", error);
  res.status(500).json({ message: error.message });
}
});



export default router;