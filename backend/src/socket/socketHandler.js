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

    socket.on("send-message", async ({ content, image, room, senderId }) => {
      const msg = await Message.create({ sender: senderId, content, image, room, type: "room" });
      const populated = await msg.populate("sender", "username profilePic");
      io.emit("new-message", populated);
    });

    socket.on("send-private-message", async ({ content, image, senderId, receiverId }) => {
      const msg = await Message.create({ sender: senderId, receiver: receiverId, content, image, type: "private" });
      const populated = await msg.populate("sender", "username profilePic");
      const receiverData = onlineUsers.get(receiverId);
      if (receiverData) {
        io.to(receiverData.socketId).emit("new-private-message", populated);
      }
      socket.emit("new-private-message", populated);
    });

    socket.on("dm-typing", ({ receiverId, username }) => {
      const receiverData = onlineUsers.get(receiverId);
      if (receiverData) io.to(receiverData.socketId).emit("dm-user-typing", username);
    });

    socket.on("dm-stop-typing", ({ receiverId }) => {
      const receiverData = onlineUsers.get(receiverId);
      if (receiverData) io.to(receiverData.socketId).emit("dm-user-stop-typing");
    });

    socket.on("delete-message", ({ messageId }) => {
      io.emit("message-deleted", messageId);
    });

    socket.on("clear-room", (room) => {
      io.emit("room-cleared", room);
    });

    socket.on("typing", ({ room, username }) => {
      socket.broadcast.emit("user-typing", { room, username });
    });

    socket.on("stop-typing", ({ room }) => {
      socket.broadcast.emit("user-stop-typing", room);
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { isOnline: false });
      io.emit("online-users", Array.from(onlineUsers.entries()).map(([id, data]) => ({ userId: id, ...data })));
    });
  });
};
