import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  messages: [],
  activeRoom: "gaming",
  chatMode: "room",
  activeDmUser: null,
  unreadRooms: {},
  unreadDms: {},

  setMessages: (msgs) => set(typeof msgs === "function"
    ? (s) => ({ messages: msgs(s.messages) })
    : { messages: msgs }),

  setActiveRoom: (room) => {
    set((s) => {
      const updated = { ...s.unreadRooms };
      delete updated[room];
      return { messages: [], activeRoom: room, chatMode: "room", activeDmUser: null, unreadRooms: updated };
    });
  },

  setActiveDm: (dmUser) => {
    set((s) => {
      const updated = { ...s.unreadDms };
      delete updated[dmUser.userId];
      return { messages: [], activeDmUser: dmUser, chatMode: "dm", unreadDms: updated };
    });
  },

  addUnreadRoom: (room) => {
    set((s) => {
      if (s.chatMode === "room" && s.activeRoom === room) return {};
      return { unreadRooms: { ...s.unreadRooms, [room]: (s.unreadRooms[room] || 0) + 1 } };
    });
  },

  addUnreadDm: (userId) => {
    set((s) => {
      if (s.chatMode === "dm" && s.activeDmUser?.userId === userId) return {};
      return { unreadDms: { ...s.unreadDms, [userId]: (s.unreadDms[userId] || 0) + 1 } };
    });
  },
}));
