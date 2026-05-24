// payment.routes.js
import express from "express";
import {
  getAllMessagesOfConversation,
  sendMessage,
  testMessage,
} from "../controllers/message.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const messageRoutes = express.Router();

messageRoutes.post("/send-message", sendMessage);
messageRoutes.post("/test-message", authMiddleware, testMessage);
messageRoutes.post(
  "/get-all-messages-of-conversation",
  authMiddleware,
  getAllMessagesOfConversation,
);

export default messageRoutes;
