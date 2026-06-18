import { useChatStore } from "../../store/useChatStore";

// general ko permanently hata kar gaming ko pehla room bana diya
const ROOMS = ["gaming", "music", "tech", "random"];

export default function RoomList() {
  const { activeRoom, setActiveRoom } = useChatStore();

  return (
    <div className="p-3">
      <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Rooms</p>
      {ROOMS.map((r) => (
        <button key={r}
          onClick={() => setActiveRoom(r)}
          className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm transition
            ${activeRoom === r
              ? "bg-violet-600 text-white"
              : "text-slate-300 hover:bg-white/10"}`}>
          # {r}
        </button>
      ))}
    </div>
  );
}