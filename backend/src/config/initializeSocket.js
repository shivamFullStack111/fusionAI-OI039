import { Server } from "socket.io";
import { User } from "../schemas/user.schema.js";

let io;

const userIdToSocketId = new Map();
const socketIdToUserId = new Map();

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
      console.log(`User ${userId} joined with socket ID: ${socket.id}`);
      userIdToSocketId.set(userId.toString(), socket.id);
      socketIdToUserId.set(socket.id, userId.toString());
    });

    socket.on(
      "send-message-by-user",
      async ({ conversationId, senderId, message, chatbot }) => {
        const ownerUser = await User.findOne({
          _id: chatbot?.userId.toString(),
        });
        const allUsersofOwner = await User.find({
          $or: [{ parentUserId: ownerUser?._id }, { _id: ownerUser?._id }],
        });

        // console.log("allUsersofOwner", allUsersofOwner);

        allUsersofOwner.forEach((user) => {
          const socketId = userIdToSocketId.get(user?._id?.toString());
          socket.to(socketId).emit("send-message-by-user", {
            conversationId,
            senderId,
            message,
            chatbot,
          });
        });
      },
    );

    socket.on(
      "send-message-by-support",
      ({ message, conversationId, receiverId }) => {
        const socketId = userIdToSocketId.get(receiverId);

        if (socketId)
          socket.to(socketId).emit("send-message-by-support", {
            message,
            conversationId,
            receiverId,
          });
      },
    );

    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected:  ${socket.id} REASON: ${reason}`);
      const userId = socketIdToUserId.get(socket.id);
      userIdToSocketId.delete(userId);
      socketIdToUserId.delete(socket.id);
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
