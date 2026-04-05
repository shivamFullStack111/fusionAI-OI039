import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema(
  {
    userId: {
      immutable: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    knowledgeType: {
      type: String,
      required: true,
      enum: ["file", "website", "text"],
    },
    webite: {
      url: String,
      content: String,
    },
    text: {
      title: String,
      content: String,
    },
    file: {
      fileType: {
        type: String,
      },
      fileName: String,
      content: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Knowledge = mongoose.model("knowledge", knowledgeSchema);
