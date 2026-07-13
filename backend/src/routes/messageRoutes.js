import express from "express";
import { getRoomMessages, getPrivateMessages, deleteMessage, clearRoom, uploadMessageImage } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { uploadMessageImage as uploadMiddleware } from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.get("/room/:room", protectRoute, getRoomMessages);
router.get("/private/:userId", protectRoute, getPrivateMessages);
router.delete("/:id", protectRoute, deleteMessage);
router.delete("/room/:room/clear", protectRoute, clearRoom);
router.post("/upload-image", protectRoute, uploadMiddleware.single("image"), uploadMessageImage);

export default router;
