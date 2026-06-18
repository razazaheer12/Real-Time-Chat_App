import { useSocketStore } from "../../store/useSocketStore";

export default function OnlineUsers() {
  const { onlineUsers } = useSocketStore();

  return (
    <div className="p-3 border-t border-white/10">
      <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
        Online — {onlineUsers.length}
      </p>
      {onlineUsers.map((userId) => (
        <div key={userId} className="flex items-center gap-2 py-1">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          <span className="text-xs text-slate-300">{userId}</span>
        </div>
      ))}
    </div>
  );
}
