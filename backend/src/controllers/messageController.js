import Message from "../models/Message.js";

export const getRoomMessages = async (req, res) => {
  try {
    const msgs = await Message.find({ room: req.params.room, type: "room" })
      .populate("sender", "username profilePic")
      .sort({ createdAt: 1 })
      .limit(50);
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPrivateMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;
    const msgs = await Message.find({
      type: "private",
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    }).populate("sender", "username profilePic").sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Message not found" });

    if (msg.sender.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not authorized" });

    await msg.deleteOne();
    res.json({ success: true, messageId: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearRoom = async (req, res) => {
  try {
    await Message.deleteMany({ room: req.params.room });
    res.json({ success: true, room: req.params.room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
