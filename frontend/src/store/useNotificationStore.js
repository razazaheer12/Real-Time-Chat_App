import { create } from "zustand";

let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

export const useNotificationStore = create((set, get) => ({
  soundEnabled: true,
  browserNotifEnabled: false,
  audioUnlocked: false,

  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  unlockAudio: () => {
    if (get().audioUnlocked) return;
    try {
      const ctx = getAudioContext();
      ctx.resume().then(() => {
        set({ audioUnlocked: true });
      });
    } catch {}
  },

  requestBrowserPermission: async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      set({ browserNotifEnabled: true });
    }
  },

  playSound: () => {
    if (!get().soundEnabled) return;
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.5;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch {}
  },

  showBrowserNotif: (title, body) => {
    if (!get().browserNotifEnabled) return;
    if (document.visibilityState === "visible") return;
    if (Notification.permission !== "granted") return;
    try {
      const notif = new Notification(title, {
        body,
        icon: "/favicon.ico",
        silent: true,
      });
      setTimeout(() => notif.close(), 4000);
    } catch {}
  },
}));
