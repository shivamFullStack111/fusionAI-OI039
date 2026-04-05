import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: {
      immutable: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    chatbotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatbot",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "member"],
    },
  },
  { timestamps: true },
);

export const Member = mongoose.model("member", memberSchema);
