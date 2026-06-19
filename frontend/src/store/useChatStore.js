import { create } from "zustand";

export const useChatStore = create((set) => ({
  messages: [],
  activeRoom: "gaming",
  chatMode: "room",
  activeDmUser: null,

  setMessages: (msgs) => set(typeof msgs === "function"
    ? (s) => ({ messages: msgs(s.messages) })
    : { messages: msgs }),

  setActiveRoom: (room) => set({ messages: [], activeRoom: room, chatMode: "room", activeDmUser: null }),

  setActiveDm: (dmUser) => set({ messages: [], activeDmUser: dmUser, chatMode: "dm" }),
}));
