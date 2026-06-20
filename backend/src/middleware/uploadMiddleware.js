import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

console.log("Cloudinary config check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat-app-avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 300, height: 300, crop: "fill" }],
  },
});

const upload = multer({ storage });

export default upload;
