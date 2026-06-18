import { create } from "zustand";
import axios from "../utils/axiosInstance";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,

  signup: async (data) => {
    set({ isLoading: true });
    const res = await axios.post("/auth/signup", data);
    set({ user: res.data, isLoading: false });
  },

  login: async (data) => {
    set({ isLoading: true });
    const res = await axios.post("/auth/login", data);
    set({ user: res.data, isLoading: false });
  },

  logout: async () => {
    await axios.post("/auth/logout");
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      const res = await axios.get("/auth/me");
      set({ user: res.data });
    } catch {
      set({ user: null });
    }
  },
}));
