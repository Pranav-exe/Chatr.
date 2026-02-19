import path from "path";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import morgan from "morgan";

dotenv.config();

import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import userRoutes from "./routes/user.routes";

import connectToMongoDB from "./db/connectToMongoDB";
import { app, server } from "./socket/socket";

const PORT: string | number = process.env.PORT || 5001;

// Middleware

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser() as any);

// CORS — allow both local dev (Vite on :3000) and Docker prod (nginx on :80)
import cors from "cors";
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

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow everything in dev, be strict in prod
      if (process.env.NODE_ENV !== "production") return callback(null, true);

      const allowed = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
        : ["http://localhost:3000", "http://localhost"];

      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked for origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
  }),
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Start server only after MongoDB is connected
connectToMongoDB()
  .then(() => {
    server.listen(PORT as number, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Bound to 0.0.0.0 (IPv4 & IPv6 support)`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("System Check: OK");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
