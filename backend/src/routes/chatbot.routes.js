import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getChatbotAndRequiredData,
  getUserChatbot,
  updateChatbot,
} from "../controllers/chatbot.controller.js";

const chatbotRoutes = express.Router();

chatbotRoutes.get("/get-user-chatbot", authMiddleware, getUserChatbot);
chatbotRoutes.post("/update", authMiddleware, updateChatbot);
chatbotRoutes.post("/get-chatbot-and-required-data", getChatbotAndRequiredData);

export default chatbotRoutes;
