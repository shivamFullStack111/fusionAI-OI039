import mongoose from "mongoose";

const chatbotSchema = new mongoose.Schema(
  {
    userId: {
      immutable: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plan",
      required: true,
    },
    primaryColor: {
      type: String,
      default: "#3266a8",
    },
    welcomeMessage: {
      type: String,
      default: "Hi! 👋 I'm your AI assistant. How can I help you today?",
    },
    totalMessages: {
      type: Number,
      default: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Chatbot = mongoose.model("chatbot", chatbotSchema);
