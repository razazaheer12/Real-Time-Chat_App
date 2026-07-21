# 💬 Real-Time Chat App (MERN STACK)

<div align="center">

**A production-grade, full-stack real-time chat application built with the MERN stack, Socket.io & Zustand**

🔗 Instant messaging • 🏠 Topic Rooms • 💌 Private DMs • 🟢 Live Presence • 🔔 Sound Alerts • 🖼️ Media Sharing

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-7c3aed?style=for-the-badge)](https://real-time-chat-app-pi-lake.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/razazaheer12/Real-Time-Chat_App)

</div>

---

## 🌟 Overview

**Real-Time Chat App** is a modern, high-performance messaging platform that provides a WhatsApp Web-level real-time communication experience. Users can sign up, join topic-based rooms, send private direct messages, share images/files, track online status, and receive audio/browser notification alerts — all wrapped in a sleek, glassmorphism-inspired dark UI.

Built from the ground up with the **MERN stack** (MongoDB, Express, React, Node.js), powered by **Socket.io** for low-latency bidirectional communication, and managed via **Zustand** with robust connection-lifecycle guards.

### ✨ [**👉 Try Live Application**](https://real-time-chat-app-pi-lake.vercel.app)

---

## 🎯 Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure signup & login with bcrypt password hashing, token sessions & password show/hide toggle |
| ⚡ **Real-Time Messaging** | Instant message delivery via Socket.io with strict multi-tab & cross-browser synchronization |
| 🏠 **Multiple Chat Rooms** | Topic-based group chat channels: `#gaming`, `#music`, `#tech`, `#random` |
| 💌 **Private DMs** | Direct one-on-one real-time private conversations |
| 🟢 **Live Presence Tracking** | Real-time 🟢 Online / 🟠 Offline status indicators and active user counts |
| ⌨️ **Typing Indicators** | Live typing status across both topic rooms and direct messaging |
| 🔔 **Unread Badges & Alerts** | Dynamic unread message notification badges + crisp audio sound alerts |
| 🖼️ **Media & File Sharing** | Real-time image and media file upload/sharing directly inside chat windows |
| 🕘 **Message History** | Persistent conversation storage powered by MongoDB Atlas, loaded seamlessly on login |
| 🗑️ **Message Management** | Delete specific individual messages or clear entire room histories |
| 👤 **Profile Management** | Custom profile picture/avatar uploads integrated with Cloudinary |

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React** (Vite) — Fast, reactive UI
- 🎨 **Tailwind CSS** — Modern utility-first styling & dark mode UI
- 🐻 **Zustand** — Lightweight global state management & socket connectivity store
- 🔌 **Socket.io-client** — Real-time WebSockets communication layer
- 🧭 **React Router** — Client-side navigation

### Backend
- 🟢 **Node.js** + **Express** — RESTful API architecture
- 🔌 **Socket.io** — WebSocket server engine with room broadcasting
- 🍃 **MongoDB Atlas** + **Mongoose** — Cloud database & data modelling
- 🔑 **JSON Web Tokens (JWT)** — Stateless HTTP & socket authentication
- 🔒 **bcrypt.js** — Secure password encryption
- ☁️ **Cloudinary** — Cloud media management for image sharing & profiles

### Deployment Architecture
| Layer | Infrastructure / Platform |
|---|---|
| **Frontend** | **Vercel** |
| **Backend & Socket Server** | **Hugging Face Spaces** (Docker Containerized) / **Render** |
| **Database** | **MongoDB Atlas** |
| **Media Hosting** | **Cloudinary** |

---

## ⚡ System Architecture Representation Diagram ARD ( Real-Time ChatApp )

<img width="458" height="306" alt="image" src="https://github.com/user-attachments/assets/31fd9a1a-1f92-4634-b4ae-7633309621f7" />


### Workflow  

Users authenticate through the React frontend using JWT-based authentication handled by the Node.js/Express backend. After login, REST APIs and Socket.io enable secure real-time messaging, while MongoDB Atlas stores all application data. The frontend is deployed on Vercel, and the backend with Socket.io runs on Hugging Face Spaces (Docker).

---

## 📂 Project Structure

```
Real-Time-Chat_App/
├── backend/
│   ├── src/
│   │   ├── config/          # DB & Cloudinary configuration
│   │   ├── controllers/     # Route logic (auth, messages, rooms)
│   │   ├── middleware/      # JWT auth guard & file upload handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   ├── socket/          # Socket.io event handlers
│   │   └── server.js        # App entry point
│   ├── Dockerfile
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Auth, chat, sidebar & shared UI components
    │   ├── pages/            # Login, Signup, Chat pages
    │   ├── store/             # Zustand stores (useAuthStore, useSocketStore, useChatStore)
    │   ├── utils/             # Axios instance config
    │   └── App.jsx
    └── package.json
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/razazaheer12/Real-Time-Chat_App.git
cd Real-Time-Chat_App
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```

The app will be live at `http://localhost:5173` 🎉

---

## 🔌 Socket.io Events

| Event | Direction | Description |
|---|---|---|
| `join-room` | Client → Server | Join a specific chat room |
| `send-message` | Client → Server | Send a message to a room |
| `new-message` | Server → Client | Broadcast new room message |
| `send-private-message` | Client → Server | Send a direct message |
| `new-private-message` | Server → Client | Deliver a private message |
| `typing` / `stop-typing` | Client → Server | Notify typing status |
| `user-typing` / `user-stop-typing` | Server → Client | Show typing indicator |
| `online-users` | Server → Client | Broadcast updated online users list |
| `delete-message` / `message-deleted` | Bidirectional | Sync message deletion |
| `clear-room` / `room-cleared` | Bidirectional | Sync room clearing |

---

## 📸 Preview

> 💡 Dark-themed, glassmorphism-inspired responsive interface featuring interactive chat bubbles, unread counter badges, and live connection logs.

### Login Page
<img width="959" height="436" alt="Screenshot 2026-07-20 235506" src="https://github.com/user-attachments/assets/b8ebf5ea-0c10-407b-a17d-59d81587e5e5" />

### Multi-Chat Rooms Preview 
<img width="959" height="437" alt="Screenshot 2026-07-20 235903" src="https://github.com/user-attachments/assets/fe3969bb-c0a2-4f91-8402-122a8e4ce290" />

### Private Direct Messaging DM Chat Preview
<img width="959" height="436" alt="image" src="https://github.com/user-attachments/assets/109e8325-7cef-42c3-bb00-040287527c59" />

> 

---

## 👤 Author

**Raza Zaheer**

[![GitHub](https://img.shields.io/badge/GitHub-razazaheer12-181717?style=flat&logo=github)](https://github.com/razazaheer12)

---

## 📄 License

This project is open-source and available for learning and personal use.

---

<div align="center">

### ⭐ If you found this project helpful, consider giving it a star!

Made with 💜 and a lot of debugging

</div>
