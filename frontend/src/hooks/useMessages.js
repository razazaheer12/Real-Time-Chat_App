import { useEffect } from "react";
import { useSocketStore } from "../store/useSocketStore";
import { useChatStore } from "../store/useChatStore";

export const useMessages = () => {
  const { socket } = useSocketStore();
  const { setMessages } = useChatStore();

  useEffect(() => {
    if (!socket) return;
    socket.on("new-message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );
    return () => socket.off("new-message");
  }, [socket]);
};
