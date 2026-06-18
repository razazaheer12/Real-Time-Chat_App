import { useChatStore } from "../../store/useChatStore";
import { useSocketStore } from "../../store/useSocketStore";
import { useAuthStore } from "../../store/useAuthStore";

// Yahan se bhi general ko khatam kar diya
const ROOMS = ["gaming", "music", "tech", "random"];

export default function Sidebar({ onClose }) {
  const { activeRoom, setActiveRoom } = useChatStore();
  const { onlineUsers } = useSocketStore();
  const { user, logout } = useAuthStore();

  const handleRoomClick = (r) => {
    setActiveRoom(r);
    onClose?.();
  };

  return (
    <aside className="w-72 md:w-64 h-full bg-slate-800 border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-violet-400">💬 ChatApp</h2>
          <p className="text-xs text-slate-400 mt-1">Hey, {user?.username}</p>
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
              ${activeRoom === r
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
          <div key={u.userId} className="flex items-center gap-2 py-1.5 px-1">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0"></span>
            <span className="text-sm text-slate-300 truncate">
              {u.username}
              {u.userId === user?._id && (
                <span className="text-slate-500"> (you)</span>
              )}
            </span>
          </div>
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