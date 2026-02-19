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
  : [
      "http://localhost:3000",
      "http://localhost:5001",
      "http://localhost",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5001",
      "http://127.0.0.1",
    ];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (process.env.NODE_ENV !== "production") return callback(null, true);

      const allowed = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
        : ["http://localhost:3000", "http://localhost"];

      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`Socket CORS blocked for origin: ${origin}`);
        callback(null, false);
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// userId -> socketId
interface UserSocketMap {
  [userId: string]: string;
}

const userSocketMap: UserSocketMap = {};

export const getReceiverSocketId = (receiverId: string) =>
  userSocketMap[receiverId];

const broadcastOnlineUsers = () =>
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  const userId = socket.handshake.query.userId as string | undefined;

  if (!userId || userId === "undefined") {
    console.warn(`Socket ${socket.id} connected without valid userId`);
  } else {
    userSocketMap[userId] = socket.id;
    broadcastOnlineUsers();
  }

  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
    }
  });

  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];

      try {
        const lastSeen = new Date();
        await User.findByIdAndUpdate(userId, { lastSeen });
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
