import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useSocketStore } from "./store/useSocketStore";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  const { user, checkAuth } = useAuthStore();
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?._id) {
      connect(user._id);
    } else {
      disconnect();
    }
  }, [user?._id]);

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
