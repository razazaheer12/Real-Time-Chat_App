import Message from "../models/Message.js";
import User from "../models/User.js";

const onlineUsers = new Map();

export const initSocket = (io) => {
  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
      const user = await User.findById(userId).select("username profilePic");
      if (user) {
        onlineUsers.set(userId, { socketId: socket.id, username: user.username, profilePic: user.profilePic });
        await User.findByIdAndUpdate(userId, { isOnline: true });
        io.emit("online-users", Array.from(onlineUsers.entries()).map(([id, data]) => ({ userId: id, ...data })));
      }
    }

    socket.on("join-room", (roomName) => {
      socket.join(roomName);
      socket.emit("joined", roomName);
    });

    socket.on("send-message", async ({ content, room, senderId }) => {
      const msg = await Message.create({ sender: senderId, content, room, type: "room" });
      const populated = await msg.populate("sender", "username profilePic");
      io.to(room).emit("new-message", populated);
    });

    socket.on("send-private-message", async ({ content, senderId, receiverId }) => {
      const msg = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
        type: "private",
      });
      const populated = await msg.populate("sender", "username profilePic");

      const receiverData = onlineUsers.get(receiverId);
      if (receiverData) {
        io.to(receiverData.socketId).emit("new-private-message", populated);
      }
      socket.emit("new-private-message", populated);
    });

    socket.on("delete-message", async ({ messageId, room }) => {
      io.to(room).emit("message-deleted", messageId);
    });

    socket.on("clear-room", (room) => {
      io.to(room).emit("room-cleared", room);
    });

    socket.on("typing", ({ room, username }) => {
      socket.to(room).emit("user-typing", username);
    });

    socket.on("stop-typing", ({ room }) => {
      socket.to(room).emit("user-stop-typing");
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { isOnline: false });
      io.emit("online-users", Array.from(onlineUsers.entries()).map(([id, data]) => ({ userId: id, ...data })));
    });
  });
};
