import http from "http";
import express, { Application } from "express";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

interface UserSocketMap {
  [userId: string]: string;
}

const userSocketMap: UserSocketMap = {};

export const getReceiverSocketId = (receiverId: string) =>
  userSocketMap[receiverId];

const broadcastOnlineUsers = () => {
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
};

io.on("connection", (socket: Socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(
      `\x1b[32m[Socket]\x1b[0m User connected: ${userId} (${socket.id})`,
    );
    broadcastOnlineUsers();
  }

  socket.on("typing", ({ receiverId }: { receiverId: string }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }: { receiverId: string }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("stopTyping", { senderId: userId });
    }
  });

  socket.on("disconnect", async () => {
    if (userId && userSocketMap[userId]) {
      console.log(`\x1b[31m[Socket]\x1b[0m User disconnected: ${userId}`);
      delete userSocketMap[userId];

      try {
        const lastSeen = new Date();
        await User.findByIdAndUpdate(userId, { lastSeen });

        // Notify others of status change
        io.emit("userStatusUpdate", {
          userId,
          isOnline: false,
          lastSeen: lastSeen.toISOString(),
        });
      } catch (error) {
        console.error("Error updating lastSeen:", error);
      }

      broadcastOnlineUsers();
    }
  });
});

export { app, io, server };
