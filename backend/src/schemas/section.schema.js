import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    userId: {
      immutable: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    sectionName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    knowledgeSourceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "knowledge",
        required: true,
      },
    ],
    tone: {
      type: String,
      required: true,
      enum: ["strict", "neutral", "friendly", "empahetic"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    allowedTopics: [{ type: String }],
    blockedTopics: [{ type: String }],
  },
  { timestamps: true },
);

export const Section = mongoose.model("section", sectionSchema);
