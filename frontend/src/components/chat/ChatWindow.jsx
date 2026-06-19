import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useSocketStore } from "../../store/useSocketStore";
import { useAuthStore } from "../../store/useAuthStore";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import Avatar from "../shared/Avatar";
import axios from "../../utils/axiosInstance";

export default function ChatWindow({ onMenuClick }) {
  const messages = useChatStore((s) => s.messages);
  const setMessages = useChatStore((s) => s.setMessages);
  const activeRoom = useChatStore((s) => s.activeRoom);
  const chatMode = useChatStore((s) => s.chatMode);
  const activeDmUser = useChatStore((s) => s.activeDmUser);
  const socket = useSocketStore((s) => s.socket);
  const user = useAuthStore((s) => s.user);
  const bottom = useRef(null);
  const [typingUser, setTypingUser] = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (chatMode === "room") setMessages((prev) => [...prev, msg]);
    };

    const handleNewPrivateMessage = (msg) => {
      if (chatMode === "dm" && activeDmUser &&
        (msg.sender._id === activeDmUser.userId || msg.receiver === activeDmUser.userId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTyping = (username) => setTypingUser(username);
    const handleStopTyping = () => setTypingUser(null);
    const handleMessageDeleted = (messageId) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };
    const handleRoomCleared = (room) => {
      if (chatMode === "room" && room === activeRoom) setMessages([]);
    };

    socket.on("new-message", handleNewMessage);
    socket.on("new-private-message", handleNewPrivateMessage);
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);
    socket.on("message-deleted", handleMessageDeleted);
    socket.on("room-cleared", handleRoomCleared);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("new-private-message", handleNewPrivateMessage);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
      socket.off("message-deleted", handleMessageDeleted);
      socket.off("room-cleared", handleRoomCleared);
    };
  }, [socket, chatMode, activeRoom, activeDmUser]);

  useEffect(() => {
    if (!socket) return;

    if (chatMode === "room" && activeRoom) {
      socket.emit("join-room", activeRoom);
      axios.get(`/messages/room/${activeRoom}`)
        .then((r) => setMessages(r.data))
        .catch(() => setMessages([]));
    } else if (chatMode === "dm" && activeDmUser) {
      axios.get(`/messages/private/${activeDmUser.userId}`)
        .then((r) => setMessages(r.data))
        .catch(() => setMessages([]));
    }
  }, [activeRoom, chatMode, activeDmUser, socket]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  const handleClearRoom = async () => {
    if (!window.confirm(`Clear ALL messages in #${activeRoom}? This cannot be undone.`)) return;
    setClearing(true);
    try {
      await axios.delete(`/messages/room/${activeRoom}/clear`);
      setMessages([]);
      socket.emit("clear-room", activeRoom);
    } catch (err) {
      alert("Could not clear room");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full min-w-0">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-white/10 bg-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden text-slate-300 hover:text-white text-xl">
            ☰
          </button>
          {chatMode === "dm" && activeDmUser ? (
            <div className="flex items-center gap-2">
              <Avatar username={activeDmUser.username} profilePic={activeDmUser.profilePic} size="sm" />
              <div>
                <h2 className="font-semibold text-white text-sm md:text-base">{activeDmUser.username}</h2>
                <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Private conversation</p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-semibold text-white text-sm md:text-base"># {activeRoom || "Select a room"}</h2>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Real-time chat room</p>
            </div>
          )}
        </div>
        {chatMode === "room" && (
          <button
            onClick={handleClearRoom}
            disabled={clearing}
            className="text-xs text-slate-400 hover:text-red-400 transition px-2 py-1 rounded-lg hover:bg-white/5 disabled:opacity-50">
            {clearing ? "Clearing..." : "🗑️ Clear Room"}
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-1">
        {messages.length === 0 && (
          <p className="text-slate-500 text-center mt-8 text-sm">
            {chatMode === "dm" ? "Say hello! 👋" : "No messages yet. Say hello! 👋"}
          </p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m._id} msg={m} isOwn={m.sender?._id === user?._id} />
        ))}
        {typingUser && <TypingIndicator username={typingUser} />}
        <div ref={bottom} />
      </div>
      <MessageInput />
    </div>
  );
}
