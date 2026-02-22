import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

// Configurations
dotenv.config();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Routes & Modules
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import userRoutes from "./routes/user.routes";
import connectToMongoDB from "./db/connectToMongoDB";
import { app, server } from "./socket/socket";

/**
 * Middleware
 */
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(cookieParser() as any);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"]; // Minimal fallback for local dev

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        NODE_ENV === "development"
      ) {
        callback(null, true);
      } else {
        console.warn(
          `\x1b[33m[CORS Target]\x1b[0m Access denied from: ${origin}`,
        );
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

/**
 * Health Check
 */
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "online",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    environment: NODE_ENV,
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

/**
 * Server Startup
 */
const startServer = async () => {
  try {
    await connectToMongoDB();
    server.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`\x1b[32m[Server]\x1b[0m Running on http://0.0.0.0:${PORT}`);
      console.log(`\x1b[34m[Env]\x1b[0m Mode: ${NODE_ENV}`);
    });
  } catch (error) {
    console.error("\x1b[31m[Critical]\x1b[0m Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
