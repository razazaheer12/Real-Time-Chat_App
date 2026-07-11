import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useSocketStore } from "./store/useSocketStore";
import { useChatStore } from "./store/useChatStore";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  const { user, checkAuth } = useAuthStore();
  const { connect, disconnect } = useSocketStore();
  const unreadRooms = useChatStore((s) => s.unreadRooms);
  const unreadDms = useChatStore((s) => s.unreadDms);
  const connectedUserId = typeof window !== "undefined"
    ? window._connectedUserId
    : null;

  const totalUnread =
    Object.values(unreadRooms).reduce((a, b) => a + b, 0) +
    Object.values(unreadDms).reduce((a, b) => a + b, 0);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?._id) connect(user._id);
    else disconnect();
  }, [user?._id]);

  useEffect(() => {
    document.title = totalUnread > 0 ? `(${totalUnread}) ChatApp` : "ChatApp";
  }, [totalUnread]);

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
