import express from "express";
import { getRooms, createRoom, joinRoom, deleteRoom } from "../controllers/roomController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();
router.get("/", protectRoute, getRooms);
router.post("/", protectRoute, createRoom);
router.post("/:id/join", protectRoute, joinRoom);
router.delete("/:id", protectRoute, deleteRoom);

export default router;
