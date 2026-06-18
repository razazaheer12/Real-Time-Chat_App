import Room from "../models/Room.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("members", "username profilePic");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exists = await Room.findOne({ name });
    if (exists) return res.status(400).json({ error: "Room already exists" });

    const room = await Room.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    if (!room.members.includes(req.user._id)) {
      room.members.push(req.user._id);
      await room.save();
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not authorized" });

    await room.deleteOne();
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
