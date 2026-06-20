import { create } from "zustand";
import axios from "../utils/axiosInstance";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,

  signup: async (data) => {
    set({ isLoading: true });
    const res = await axios.post("/auth/signup", data);
    localStorage.setItem("chatapp_token", res.data.token);
    set({ user: res.data, isLoading: false });
  },

  login: async (data) => {
    set({ isLoading: true });
    const res = await axios.post("/auth/login", data);
    localStorage.setItem("chatapp_token", res.data.token);
    set({ user: res.data, isLoading: false });
  },

  logout: async () => {
    localStorage.removeItem("chatapp_token");
    set({ user: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("chatapp_token");
    if (!token) {
      set({ user: null });
      return;
    }
    try {
      const res = await axios.get("/auth/me");
      set({ user: res.data });
    } catch {
      localStorage.removeItem("chatapp_token");
      set({ user: null });
    }
  },

  uploadProfilePic: async (file) => {
    const formData = new FormData();
    formData.append("profilePic", file);
    const res = await axios.post("/auth/upload-profile-pic", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    set({ user: res.data });
  },
}));
