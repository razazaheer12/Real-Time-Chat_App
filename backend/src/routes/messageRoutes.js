import express from "express";
import { getRoomMessages, getPrivateMessages, deleteMessage, clearRoom } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();
router.get("/room/:room", protectRoute, getRoomMessages);
router.get("/private/:userId", protectRoute, getPrivateMessages);
router.delete("/:id", protectRoute, deleteMessage);
router.delete("/room/:room/clear", protectRoute, clearRoom);

export default router;
