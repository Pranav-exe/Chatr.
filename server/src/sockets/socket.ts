import http from "http";
import express, { Application } from "express";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import User from "../models/user.model";
import { createAdapter } from "@socket.io/redis-adapter";
import redisClient from "../utils/redis";

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

/**
 * REDIS ADAPTER INTEGRATION
 * Why? This allows us to scale Chatr to multiple server instances.
 * Any event emitted on Server A will be sent to Redis, which then
 * broadcasts it to all other connected Chatr servers.
 */
const setupRedisAdapter = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // The adapter needs two separate connections to Redis:
    // 1. One for Publishing (sending)
    // 2. One for Subscribing (receiving)
    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));
    console.log(
      "\x1b[32m[Socket]\x1b[0m Redis adapter integrated successfully",
    );
  } catch (err) {
    console.error(
      "\x1b[31m[Socket Error]\x1b[0m Failed to setup Redis adapter:",
      err,
    );
  }
};

setupRedisAdapter();

interface UserSocketMap {
  [userId: string]: string;
}

const userSocketMap: UserSocketMap = {};

export const getReceiverSocketId = (receiverId: string) =>
  userSocketMap[receiverId];

const broadcastOnlineUsers = async () => {
  try {
    const users = await redisClient.sMembers("online_users");
    io.emit("getOnlineUsers", users);
  } catch (err) {
    console.error("Redis Error in broadcastOnlineUsers:", err);
  }
};

io.on("connection", (socket: Socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(
      `\x1b[32m[Socket]\x1b[0m User connected: ${userId} (${socket.id})`,
    );

    // Add user to Redis Set for global tracking
    redisClient.sAdd("online_users", userId).then(() => {
      broadcastOnlineUsers();
    });
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

        // Remove user from Redis Set
        await redisClient.sRem("online_users", userId);

        // Notify others of status change
        io.emit("userStatusUpdate", {
          userId,
          isOnline: false,
          lastSeen: lastSeen.toISOString(),
        });

        broadcastOnlineUsers();
      } catch (error) {
        console.error("Error during disconnect cleanup:", error);
      }
    }
  });
});

export { app, io, server };
