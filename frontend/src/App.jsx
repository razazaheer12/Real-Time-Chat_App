import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useSocketStore } from "./store/useSocketStore";
import { useChatStore } from "./store/useChatStore";
import { useNotificationStore } from "./store/useNotificationStore";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  const { user, checkAuth } = useAuthStore();
  const { connect, disconnect } = useSocketStore();
  const unreadRooms = useChatStore((s) => s.unreadRooms);
  const unreadDms = useChatStore((s) => s.unreadDms);
  const { unlockAudio } = useNotificationStore();
  const connectedRef = useRef(null);

  const totalUnread =
    Object.values(unreadRooms).reduce((a, b) => a + b, 0) +
    Object.values(unreadDms).reduce((a, b) => a + b, 0);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?._id && connectedRef.current !== user._id) {
      connectedRef.current = user._id;
      connect(user._id);
    } else if (!user) {
      connectedRef.current = null;
      disconnect();
    }
  }, [user?._id]);

  useEffect(() => {
    document.title = totalUnread > 0 ? `(${totalUnread}) ChatApp` : "ChatApp";
  }, [totalUnread]);

  useEffect(() => {
    const unlock = () => {
      unlockAudio();
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
