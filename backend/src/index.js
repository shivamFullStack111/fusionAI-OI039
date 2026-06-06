import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import CookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import { connectDB } from "./config/dbConnect.js";
import paymentRoutes from "./routes/payment.routes.js";
import planRoutes from "./routes/plan.routes.js";
import knowledgeRoutes from "./routes/knowledge.routes.js";
import sectionRoutes from "./routes/section.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import messageRoutes from "./routes/message.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./config/initializeSocket.js";

// configs
dotenv.config();

const app = express();

connectDB();

const origin = process.env.FRONTEND_URL || "http://localhost:5173";

// middlewares
app.use(
  cors({
    origin: origin, // React ka exact URL
    credentials: true, // ← YEH ZAROORI HAI
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(
  express.json({
    limit: "50mb",
  }),
);
app.use(CookieParser());
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/section", sectionRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/workspace", workspaceRoutes);

// health -
app.get("/", (req, res) => {
  return res.send({ success: true, message: "server listening" });
});

// creating server so we could run socket and express server in same port

const server = http.createServer(app);
const io = initializeSocket(server);

// server listeningp--
server.listen(7474, "0.0.0.0", () => {
  console.log("Server running on port 7474");
});
