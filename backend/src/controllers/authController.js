import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  res.json({ message: "Logged out" });
};

export const getMe = (req, res) => {
  res.json(req.user);
};

export const uploadProfilePic = async (req, res) => {
  try {
    console.log("Upload request received. req.file:", req.file);
    console.log("req.body:", req.body);

    if (!req.file) {
      console.log("ERROR: No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File path from Cloudinary:", req.file.path);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: req.file.path },
      { new: true }
    ).select("-password");

    console.log("User updated successfully:", user.username);
    res.json(user);
  } catch (err) {
    console.log("UPLOAD ERROR MESSAGE:", err.message);
    console.log("UPLOAD ERROR STACK:", err.stack);
    res.status(500).json({ error: err.message });
  }
};
