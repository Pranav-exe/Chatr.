import http from "http";
import express, { Application } from "express";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000", // must match client
    methods: ["GET", "POST"],
    credentials: true, // allow cookies
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

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      broadcastOnlineUsers();
    }
  });
});

export { app, io, server };
