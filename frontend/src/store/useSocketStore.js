import { create } from "zustand";
import { io } from "socket.io-client";

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  connect: (userId) => {
    const existing = get().socket;
    if (existing && existing.connected) return;
    if (existing) existing.disconnect();

    const socket = io("http://localhost:5000", {
      query: { userId },
      withCredentials: true,
    });

    socket.on("online-users", (users) => {
      set({ onlineUsers: users });
    });

    set({ socket });
  },

  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));
