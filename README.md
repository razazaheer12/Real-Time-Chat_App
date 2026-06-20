# 💬 Real-Time Chat App

<div align="center">

**A full-stack real-time chat application built with the MERN stack and Socket.io**

🔗 Instant messaging • 🏠 Multiple rooms • 💌 Private DMs • 🟢 Live presence • 🖼️ Profile uploads

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-7c3aed?style=for-the-badge)](https://real-time-chat-app-pi-lake.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/razazaheer12/Real-Time-Chat_App)

</div>

---

## 🌟 Overview

**Real-Time Chat App** is a modern, production-ready messaging platform where users can sign up, join topic-based chat rooms, send private direct messages, see who's online in real time, and personalize their profile — all wrapped in a sleek, mobile-responsive dark UI.

Built from the ground up with the **MERN stack** (MongoDB, Express, React, Node.js) and powered by **Socket.io** for instant, bidirectional communication.

### ✨ [**👉 Try it Live**](https://real-time-chat-app-pi-lake.vercel.app)

---

## 🎯 Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure signup & login with hashed passwords (bcrypt) and token-based sessions |
| ⚡ **Real-Time Messaging** | Instant message delivery via Socket.io — zero refresh needed |
| 🏠 **Multiple Chat Rooms** | Jump between topic-based rooms: `gaming`, `music`, `tech`, `random` |
| 💌 **Private Messaging (DMs)** | One-on-one private conversations between users |
| 🟢 **Online/Offline Presence** | See exactly who's online in real time, with live avatars |
| ⌨️ **Typing Indicator** | Know when someone's typing a reply |
| 🕘 **Message History** | All messages persisted in MongoDB and loaded on login |
| 🗑️ **Message Management** | Delete your own messages, or clear an entire room |
| 🖼️ **Profile Picture Upload** | Upload and update avatars via Cloudinary integration |
| 📱 **Fully Responsive** | Seamless experience across mobile, tablet, and desktop |

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React** (Vite) — fast, modern UI
- 🎨 **Tailwind CSS** — utility-first responsive styling
- 🐻 **Zustand** — lightweight global state management
- 🔌 **Socket.io-client** — real-time client connection
- 🧭 **React Router** — client-side routing

### Backend
- 🟢 **Node.js** + **Express** — REST API server
- 🔌 **Socket.io** — WebSocket-based real-time engine
- 🍃 **MongoDB Atlas** + **Mongoose** — cloud-hosted database & ODM
- 🔑 **JWT** — stateless authentication
- 🔒 **bcrypt.js** — password hashing
- ☁️ **Cloudinary** — image hosting for profile pictures

### Deployment
| Layer | Platform |
|---|---|
| Frontend | **Vercel** |
| Backend + Socket.io | **Hugging Face Spaces** (Docker) |
| Database | **MongoDB Atlas** |
| Image Storage | **Cloudinary** |

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
    │   ├── store/             # Zustand stores (auth, chat, socket)
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

> 💡 Dark-themed, glassmorphism-inspired UI with violet accents, real-time message bubbles, and a responsive sidebar that adapts from desktop to mobile.

---

## 🗺️ Roadmap

- [ ] 🔔 Unread message notification badges
- [ ] 😄 Message reactions (emoji)
- [ ] 📎 File/image sharing in chat
- [ ] 🔍 Message search

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
