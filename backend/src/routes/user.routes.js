import express from "express";
import {
  changePassword,
  createUserMember,
  deleteUserMember,
  getDashboardData,
  getUserMembers,
  isAuthenticated,
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isSubscribed } from "../middleware/isSubscribed.middleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/logout", logout);
userRoutes.get("/dashboard/get-data", authMiddleware, getDashboardData);
userRoutes.get("/refresh-token", refreshToken);
userRoutes.get("/isAuthenticated", authMiddleware, isAuthenticated);
userRoutes.post("/change-password", authMiddleware, changePassword);
userRoutes.post(
  "/member/create",
  authMiddleware,
  isSubscribed,
  createUserMember,
);
userRoutes.post("/member/get-user-members", authMiddleware, getUserMembers);
userRoutes.post("/member/delete", authMiddleware, deleteUserMember);

export default userRoutes;
