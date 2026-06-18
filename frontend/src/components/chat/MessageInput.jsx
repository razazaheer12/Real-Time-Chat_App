import { useState, useRef } from "react";
import { useSocketStore } from "../../store/useSocketStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

export default function MessageInput() {
  const [text, setText] = useState("");
  const { socket } = useSocketStore();
  const { user } = useAuthStore();
  const { activeRoom } = useChatStore();
  const typingTimeout = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    if (!socket || !activeRoom) return;

    socket.emit("typing", { room: activeRoom, username: user?.username });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", { room: activeRoom });
    }, 1500);
  };

  const send = () => {
    if (!text.trim() || !activeRoom || !socket) return;
    socket.emit("send-message", {
      content: text,
      room: activeRoom,
      senderId: user._id,
    });
    socket.emit("stop-typing", { room: activeRoom });
    clearTimeout(typingTimeout.current);
    setText("");
  };

  return (
    <div className="p-3 md:p-4 border-t border-white/10 bg-slate-800 flex gap-2">
      <input
        value={text}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder={`Message #${activeRoom}`}
        className="flex-1 bg-slate-700 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 min-w-0"
      />
      <button
        onClick={send}
        className="bg-violet-600 hover:bg-violet-700 text-white px-4 md:px-5 rounded-xl font-medium transition text-sm md:text-base shrink-0">
        Send
      </button>
    </div>
  );
}
