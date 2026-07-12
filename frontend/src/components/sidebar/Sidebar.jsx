import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useSocketStore } from "../../store/useSocketStore";
import { useAuthStore } from "../../store/useAuthStore";
import Avatar from "../shared/Avatar";
import axios from "../../utils/axiosInstance";

const ROOMS = ["gaming", "music", "tech", "random"];

export default function Sidebar({ onClose }) {
  const { activeRoom, chatMode, activeDmUser, setActiveRoom, setActiveDm, unreadRooms, unreadDms } = useChatStore();
  const { onlineUsers } = useSocketStore();
  const { user, logout, uploadProfilePic } = useAuthStore();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    axios.get("/users").then((r) => setAllUsers(r.data)).catch(() => {});
  }, []);

  const usersWithStatus = allUsers.map((u) => ({
    ...u,
    isOnline: onlineUsers.some((ou) => ou.userId === u._id),
    profilePic: onlineUsers.find((ou) => ou.userId === u._id)?.profilePic || u.profilePic,
  }));

  const handleRoomClick = (r) => {
    setActiveRoom(r);
    onClose?.();
  };

  const handleUserClick = (u) => {
    setActiveDm({ userId: u._id, username: u.username, profilePic: u.profilePic });
    onClose?.();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadProfilePic(file);
    } catch {
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const totalUnread =
    Object.values(unreadRooms).reduce((a, b) => a + b, 0) +
    Object.values(unreadDms).reduce((a, b) => a + b, 0);

  const onlineCount = usersWithStatus.filter((u) => u.isOnline).length;

  return (
    <aside className="w-72 md:w-64 h-full bg-slate-800 border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="relative group" title="Change profile picture">
            <Avatar username={user?.username} profilePic={user?.profilePic} size="md" />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs">
              {uploading ? "..." : "📷"}
            </div>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-violet-400">💬 ChatApp</h2>
              {totalUnread > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{user?.username}</p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white text-xl px-2">✕</button>
      </div>

      <div className="p-3 border-b border-white/10">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Rooms</p>
        {ROOMS.map((r) => (
          <button key={r} onClick={() => handleRoomClick(r)}
            className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm transition flex items-center justify-between
              ${chatMode === "room" && activeRoom === r ? "bg-violet-600 text-white" : "text-slate-300 hover:bg-white/10"}`}>
            <span># {r}</span>
            {unreadRooms[r] > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {unreadRooms[r] > 99 ? "99+" : unreadRooms[r]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
          Users — {onlineCount} online
        </p>
        {usersWithStatus.length === 0 && (
          <p className="text-xs text-slate-500">No users found</p>
        )}
        {usersWithStatus.map((u) => (
          <button key={u._id} onClick={() => handleUserClick(u)}
            className={`w-full flex items-center justify-between py-2 px-2 rounded-lg mb-1 transition
              ${chatMode === "dm" && activeDmUser?.userId === u._id
                ? "bg-violet-600"
                : "hover:bg-white/10"}`}>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Avatar username={u.username} profilePic={u.profilePic} size="sm" />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-800
                  ${u.isOnline ? "bg-green-400" : "bg-orange-400"}`} />
              </div>
              <span className="text-sm text-slate-300 truncate">{u.username}</span>
            </div>
            {unreadDms[u._id] > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {unreadDms[u._id] > 99 ? "99+" : unreadDms[u._id]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-white/10">
        <button onClick={logout}
          className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-white/10 transition">
          Logout
        </button>
      </div>
    </aside>
  );
}
