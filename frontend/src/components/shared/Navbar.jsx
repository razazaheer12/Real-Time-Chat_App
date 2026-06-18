import { useAuthStore } from "../../store/useAuthStore";
import Avatar from "./Avatar";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="h-14 bg-slate-800 border-b border-white/10 flex items-center justify-between px-6">
      <h1 className="text-violet-400 font-bold text-lg">💬 ChatApp</h1>
      <div className="flex items-center gap-3">
        <Avatar username={user?.username} size="sm" />
        <span className="text-sm text-slate-300">{user?.username}</span>
        <button
          onClick={logout}
          className="text-xs text-red-400 hover:text-red-300 transition">
          Logout
        </button>
      </div>
    </nav>
  );
}
