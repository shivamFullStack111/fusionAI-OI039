import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    planType: {
      type: String,
      required: true,
      enum: ["free", "popular", "bussiness"],
    },
    price: {
      type: Number,
      required: true,
    },
    showBranding: {
      type: Boolean,
      required: true,
    },
    conversationHistory: {
      type: Boolean,
      required: true,
    },
    customizePromt: {
      type: Boolean,
      required: true,
    },
    totalTeamMembers: {
      type: Number,
      required: true,
    },
    totalKnowledges: {
      type: Number,
      required: true,
    },
    // per month
    totalMessages: {
      type: Number,
      required: true,
    },
    prioritySupport: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

export const Plan = mongoose.model("plan", planSchema);
