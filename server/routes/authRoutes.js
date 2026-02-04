import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import upload from "../middleware/upload.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

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

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
  token,
  username: user.username,
  profilePic: user.profilePic,
  email: user.email
});


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



//Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
  token,
  username: user.username,
  profilePic: user.profilePic,
  email: user.email
});


  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


//update user info
router.put(
  "/update-user",
  authMiddleware, // ✅ MUST BE FIRST
  upload.single("profilePic"), async (req, res) => {
  try {

    const { id } = req.user; // from JWT middleware

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