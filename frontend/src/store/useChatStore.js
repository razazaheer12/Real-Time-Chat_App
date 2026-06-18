import { create } from "zustand";

export const useChatStore = create((set) => ({
  messages: [],
  // default room badal kar gaming kar diya taaki login par koi blank state ya bug na aaye
  activeRoom: "gaming", 
  setMessages: (msgs) => set(typeof msgs === "function"
    ? (s) => ({ messages: msgs(s.messages) })
    : { messages: msgs }),
  setActiveRoom: (room) => set({ messages: [], activeRoom: room }),
}));