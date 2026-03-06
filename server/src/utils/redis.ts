import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redisClient = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
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
    } catch (error) {
      console.error("\x1b[31m[Redis]\x1b[0m Connection failed:", error);
    }
  }
};

export default redisClient;
