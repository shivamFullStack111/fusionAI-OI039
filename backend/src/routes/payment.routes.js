// payment.routes.js
import express from "express";
import {
  createOrder,
  purchaseFreepPlan,
  verifyPayment,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isSubscribed } from "../middleware/isSubscribed.middleware.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/create-order", authMiddleware,createOrder);
paymentRoutes.post("/verify-payment",authMiddleware, verifyPayment);
paymentRoutes.post("/purchase-free-plan",authMiddleware, purchaseFreepPlan);

export default paymentRoutes;
