import { create } from "zustand";
import { io } from "socket.io-client";

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  connect: (userId) => {
    const existing = get().socket;
    if (existing && existing.connected) return;
    if (existing) {
      existing.disconnect();
      existing.removeAllListeners();
    }

    const socket = io(import.meta.env.VITE_API_URL, {
      query: { userId },
      withCredentials: true,
      transports: ["polling", "websocket"],
    });

    socket.on("connect", () => {
      set({ socket });
    });

    socket.on("online-users", (users) => {
      set({ onlineUsers: users });
    });

    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });
  },

  disconnect: () => {
    const existing = get().socket;
    if (existing) {
      existing.disconnect();
      existing.removeAllListeners();
    }
    set({ socket: null, onlineUsers: [] });
  },
}));
