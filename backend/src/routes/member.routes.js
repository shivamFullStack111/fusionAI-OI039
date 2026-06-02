import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isSubscribed } from "../middleware/isSubscribed.middleware.js";
import {
  createMember,
  deleteMember,
  getUserAllMember,
} from "../controllers/member.controller.js";

export const memberRoutes = express.Router();

memberRoutes.post("/create", authMiddleware, isSubscribed, createMember);
memberRoutes.post("/get-user-members", authMiddleware, getUserAllMember);
memberRoutes.post("/delete", authMiddleware, deleteMember);
