// payment.routes.js
import express from "express";
import {
  getAllMessagesOfConversation,
  sendMessage,
  sendMessageBySupport,
  testMessage,
} from "../controllers/message.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const messageRoutes = express.Router();

messageRoutes.post("/send-message", sendMessage);
messageRoutes.post("/test-message", authMiddleware, testMessage);
messageRoutes.post(
  "/send-message-by-support",
  authMiddleware,
  sendMessageBySupport,
);
messageRoutes.post(
  "/get-all-messages-of-conversation",
  getAllMessagesOfConversation,
);

export default messageRoutes;
