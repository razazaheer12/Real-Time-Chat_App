import { create } from "zustand";
import { io } from "socket.io-client";

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  connect: (userId) => {
    const existing = get().socket;
    if (existing) {
      existing.disconnect();
      existing.removeAllListeners();
    }

    const socket = io(import.meta.env.VITE_API_URL, {
      query: { userId },
      withCredentials: true,
    });

    socket.on("connect", () => {
      set({ socket });
    });

    socket.on("online-users", (users) => {
      set({ onlineUsers: users });
    });

    socket.on("disconnect", () => {
      set({ socket: null });
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
