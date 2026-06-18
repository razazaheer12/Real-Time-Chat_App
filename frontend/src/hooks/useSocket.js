import { useEffect } from "react";
import { useSocketStore } from "../store/useSocketStore";
import { useAuthStore } from "../store/useAuthStore";

export const useSocket = () => {
  const { connect, disconnect } = useSocketStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) connect(user._id);
    return () => disconnect();
  }, [user]);
};
