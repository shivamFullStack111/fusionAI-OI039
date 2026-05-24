import express from "express";
import {
  addKnowledge,
  deleteKnowledge,
  getAllKnowledge,
  updateKnowledge,
} from "../controllers/knowledge.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isSubscribed } from "../middleware/isSubscribed.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { getAllConversations, getUserAllConversations, submitReview } from "../controllers/conversation.controller.js";

const conversationRoutes = express.Router();

conversationRoutes.post(
  "/get-all-user-conversations",
  authMiddleware,
  getAllConversations,
);
conversationRoutes.post("/submit-review", authMiddleware, submitReview);
conversationRoutes.post("/get-user-all-conversations", getUserAllConversations);

export default conversationRoutes;
