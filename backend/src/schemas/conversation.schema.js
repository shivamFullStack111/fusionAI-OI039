import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatbot",
      required: true,
      immutable: true,
    },
    externaluserId: {
      immutable: true,
      type: String,
    },
    title: {
      // this will created by AI
      type: String,
    },
    isEnded: {
      type: Boolean,
      default: false,
    },
    review: {
      ratings: {
        type: Number,
      },
      message: {
        type: String,
      },
    },
    isTicketRaised:{
      type:Boolean,
      default:false,
    },
    ticketResolved:{
      type:Boolean,
      default:false,
    }
  },
  { timestamps: true },
);

export const Conversation = mongoose.model("conversation", conversationSchema);
