import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getWorkspace,
  updateWorkspace,
  updateAIConfig,
  updateRAGConfig,
  addAllowedTopic,
  removeAllowedTopic,
  addBlockedTopic,
  removeBlockedTopic,
  getAllowedTopics,
  getBlockedTopics,
  getRAGConfig,
  getAIConfig,
} from "../controllers/workspace.controller.js";

const router = Router();

// ========== BASIC WORKSPACE OPERATIONS ==========
router.post("/get", authMiddleware, getWorkspace);
router.post("/update", authMiddleware, updateWorkspace);

// ========== AI CONFIG ==========
router.post("/ai-config/get", authMiddleware, getAIConfig);
router.post("/ai-config/update", authMiddleware, updateAIConfig);

// ========== RAG CONFIG ==========
router.post("/rag-config/get", authMiddleware, getRAGConfig);
router.post("/rag-config/update", authMiddleware, updateRAGConfig);

// ========== ALLOWED TOPICS ==========
router.post("/allowed-topics/get", authMiddleware, getAllowedTopics);
router.post("/allowed-topics/add", authMiddleware, addAllowedTopic);
router.post("/allowed-topics/remove", authMiddleware, removeAllowedTopic);

// ========== BLOCKED TOPICS ==========
router.post("/blocked-topics/get", authMiddleware, getBlockedTopics);
router.post("/blocked-topics/add", authMiddleware, addBlockedTopic);
router.post("/blocked-topics/remove", authMiddleware, removeBlockedTopic);

export default router;
