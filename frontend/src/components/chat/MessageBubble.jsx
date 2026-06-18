import { useState } from "react";
import { useSocketStore } from "../../store/useSocketStore";
import { useChatStore } from "../../store/useChatStore";
import axios from "../../utils/axiosInstance";

export default function MessageBubble({ msg, isOwn }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { setMessages, activeRoom } = useChatStore();
  const socket = useSocketStore((s) => s.socket);

  const handleDelete = async () => {
    if (!window.confirm("Delete this message?")) return;
    setDeleting(true);
    try {
      await axios.delete(`/messages/${msg._id}`);
      socket.emit("delete-message", { messageId: msg._id, room: activeRoom });
      setMessages((prev) => prev.filter((m) => m._id !== msg._id));
    } catch (err) {
      alert("Could not delete message");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1 group`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-end gap-1">
        {isOwn && hovered && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-slate-500 hover:text-red-400 transition text-xs mb-1 px-1"
            title="Delete message">
            🗑️
          </button>
        )}
        <div className={`max-w-[80%] sm:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-2xl text-sm
          ${isOwn
            ? "bg-violet-600 text-white rounded-br-sm"
            : "bg-slate-700 text-slate-100 rounded-bl-sm"}`}>
          {!isOwn && (
            <p className="text-xs text-violet-400 font-medium mb-0.5">
              {msg.sender?.username}
            </p>
          )}
          <p className="break-words">{msg.content}</p>
          <p className="text-xs opacity-50 mt-0.5 text-right">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
