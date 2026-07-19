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
    } catch {
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
      <div className="flex items-end gap-1 max-w-[85%] sm:max-w-[75%] md:max-w-[65%]">
        {isOwn && hovered && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-slate-500 hover:text-red-400 transition text-xs mb-1 px-1 shrink-0"
            title="Delete message">
            🗑️
          </button>
        )}
        <div className={`w-full rounded-2xl text-sm overflow-hidden
          ${isOwn
            ? "bg-violet-600 text-white rounded-br-sm"
            : "bg-slate-700 text-slate-100 rounded-bl-sm"}`}>
          {!isOwn && msg.sender?.username && (
            <p className="text-xs text-violet-400 font-medium px-3 pt-2">
              {msg.sender.username}
            </p>
          )}
          {msg.image && (
            <a href={msg.image} target="_blank" rel="noopener noreferrer">
              <img
                src={msg.image}
                alt="shared"
                className="max-w-full max-h-60 object-cover cursor-pointer hover:opacity-90 transition"
              />
            </a>
          )}
          {msg.content && (
            <p className="break-words whitespace-pre-wrap px-3 py-2">{msg.content}</p>
          )}
          <p className={`text-xs opacity-50 pb-1.5 pr-3 text-right`}>
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
