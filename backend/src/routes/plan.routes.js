import { createPlan, getAllPlan } from "../controllers/plan.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import express from 'express'

const planRoutes = express.Router();

planRoutes.post("/create", authMiddleware, createPlan);
planRoutes.get("/get-all", getAllPlan);

export default planRoutes;
