import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat-app-avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 300, height: 300, crop: "fill" }],
  },
});

const messageImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat-app-messages",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

export const uploadProfile = multer({ storage: profileStorage });
export const uploadMessageImage = multer({ storage: messageImageStorage });
