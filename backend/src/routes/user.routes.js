import express from "express";
import {
  changePassword,
  getDashboardData,
  isAuthenticated,
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/logout", logout);
userRoutes.get("/dashboard/get-data", authMiddleware, getDashboardData);
userRoutes.get("/refresh-token", refreshToken);
userRoutes.get("/isAuthenticated", authMiddleware, isAuthenticated);
userRoutes.post("/change-password", authMiddleware, changePassword);

export default userRoutes;