import express from "express";
import http from "http";
import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected: " + socket.id);

    socket.on("join-user", ({ userId }) => {
      console.log("userId:", userId);
    });

    socket.on("message-by-user", ({ userId, message, conversationId }) => {
      console.log("Received message from userId:", userId, "message:", message);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id);

      console.log("disconnecting userId:", userId);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
