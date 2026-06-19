import { useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useSocketStore } from "../../store/useSocketStore";
import { useAuthStore } from "../../store/useAuthStore";
import Avatar from "../shared/Avatar";

const ROOMS = ["gaming", "music", "tech", "random"];

export default function Sidebar({ onClose }) {
  const { activeRoom, chatMode, activeDmUser, setActiveRoom, setActiveDm } = useChatStore();
  const { onlineUsers } = useSocketStore();
  const { user, logout, uploadProfilePic } = useAuthStore();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleRoomClick = (r) => {
    setActiveRoom(r);
    onClose?.();
  };

  const handleUserClick = (u) => {
    if (u.userId === user?._id) return;
    setActiveDm(u);
    onClose?.();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadProfilePic(file);
    } catch (err) {
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <aside className="w-72 md:w-64 h-full bg-slate-800 border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative group"
            title="Change profile picture">
            <Avatar username={user?.username} profilePic={user?.profilePic} size="md" />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs">
              {uploading ? "..." : "📷"}
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div>
            <h2 className="text-sm font-bold text-violet-400">💬 ChatApp</h2>
            <p className="text-xs text-slate-400">{user?.username}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden text-slate-400 hover:text-white text-xl px-2">
          ✕
        </button>
      </div>

      <div className="p-3 border-b border-white/10">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Rooms</p>
        {ROOMS.map((r) => (
          <button key={r}
            onClick={() => handleRoomClick(r)}
            className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm transition
              ${chatMode === "room" && activeRoom === r
                ? "bg-violet-600 text-white"
                : "text-slate-300 hover:bg-white/10"}`}>
            # {r}
          </button>
        ))}
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
          Online — {onlineUsers.length}
        </p>
        {onlineUsers.length === 0 && (
          <p className="text-xs text-slate-500">No one online</p>
        )}
        {onlineUsers.map((u) => (
          <button
            key={u.userId}
            onClick={() => handleUserClick(u)}
            disabled={u.userId === user?._id}
            className={`w-full flex items-center gap-2 py-2 px-2 rounded-lg mb-1 transition
              ${chatMode === "dm" && activeDmUser?.userId === u.userId
                ? "bg-violet-600"
                : u.userId === user?._id ? "" : "hover:bg-white/10"}`}>
            <Avatar username={u.username} profilePic={u.profilePic} size="sm" />
            <span className="text-sm text-slate-300 truncate">
              {u.username}
              {u.userId === user?._id && (
                <span className="text-slate-500"> (you)</span>
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-white/10 transition">
          Logout
        </button>
      </div>
    </aside>
  );
}
