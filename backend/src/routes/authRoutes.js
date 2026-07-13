import express from "express";
import { signup, login, logout, getMe, uploadProfilePic } from "../controllers/authController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { uploadProfile } from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);
router.post("/upload-profile-pic", protectRoute, uploadProfile.single("profilePic"), uploadProfilePic);

export default router;
