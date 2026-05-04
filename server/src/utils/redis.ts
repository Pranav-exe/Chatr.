import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_URL = process.env.REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}`;

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) =>
  console.error("\x1b[31m[Redis Error]\x1b[0m", err),
);
redisClient.on("connect", () =>
  console.log("\x1b[34m[Redis]\x1b[0m Connecting..."),
);
redisClient.on("ready", () =>
  console.log("\x1b[32m[Redis]\x1b[0m Ready and connected"),
);

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      
      // 🧹 Clean Slate: Clear stale online status once upon connection
      await redisClient.del("online_users");
      console.log("\x1b[34m[Redis]\x1b[0m Online status set flushed");
      
    } catch (error) {
      console.error("\x1b[31m[Redis]\x1b[0m Connection failed:", error);
      if (process.env.NODE_ENV === "production") throw error;
    }
  }
};

export default redisClient;
