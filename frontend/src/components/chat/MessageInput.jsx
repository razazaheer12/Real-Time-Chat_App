import { useState, useRef } from "react";
import { useSocketStore } from "../../store/useSocketStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import axios from "../../utils/axiosInstance";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const socket = useSocketStore((s) => s.socket);
  const user = useAuthStore((s) => s.user);
  const chatMode = useChatStore((s) => s.chatMode);
  const activeRoom = useChatStore((s) => s.activeRoom);
  const activeDmUser = useChatStore((s) => s.activeDmUser);
  const typingTimeout = useRef(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    if (!socket) return;

    if (chatMode === "room" && activeRoom) {
      socket.emit("typing", { room: activeRoom, username: user?.username });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit("stop-typing", { room: activeRoom });
      }, 1500);
    } else if (chatMode === "dm" && activeDmUser) {
      socket.emit("dm-typing", { receiverId: activeDmUser.userId, username: user?.username });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit("dm-stop-typing", { receiverId: activeDmUser.userId });
      }, 1500);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const send = async () => {
    if (!text.trim() && !imageFile) return;
    if (!socket) return;

    setUploading(true);
    let imageUrl = "";

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await axios.post("/messages/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.imageUrl;
      }

      if (chatMode === "room" && activeRoom) {
        socket.emit("send-message", {
          content: text,
          image: imageUrl,
          room: activeRoom,
          senderId: user._id,
        });
        socket.emit("stop-typing", { room: activeRoom });
        clearTimeout(typingTimeout.current);
      } else if (chatMode === "dm" && activeDmUser) {
        socket.emit("send-private-message", {
          content: text,
          image: imageUrl,
          senderId: user._id,
          receiverId: activeDmUser.userId,
        });
        socket.emit("dm-stop-typing", { receiverId: activeDmUser.userId });
        clearTimeout(typingTimeout.current);
      }

      setText("");
      removeImage();
    } catch {
      alert("Failed to send. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const placeholder = chatMode === "dm" && activeDmUser
    ? `Message ${activeDmUser.username}`
    : `Message #${activeRoom}`;

  return (
    <div className="border-t border-white/10 bg-slate-800 shrink-0">
      {imagePreview && (
        <div className="px-3 pt-3 flex items-center gap-2">
          <div className="relative inline-block">
            <img src={imagePreview} alt="preview" className="h-16 w-16 object-cover rounded-lg border border-white/20" />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="p-3 flex gap-2 items-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-slate-400 hover:text-violet-400 transition shrink-0 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10"
          title="Attach image">
          📎
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        <input
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder={placeholder}
          disabled={uploading}
          className="flex-1 bg-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 min-w-0 disabled:opacity-50"
        />
        <button
          onClick={send}
          disabled={uploading || (!text.trim() && !imageFile)}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl font-medium transition shrink-0 w-10 h-10 flex items-center justify-center">
          {uploading ? "⏳" : "➤"}
        </button>
      </div>
    </div>
  );
}
