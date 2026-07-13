import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, default: "" },
  image:   { type: String, default: "" },
  room:    { type: String, default: "general" },
  receiver:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type:    { type: String, enum: ["room", "private"], default: "room" },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
