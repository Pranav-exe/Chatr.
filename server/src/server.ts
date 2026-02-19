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


// CORS if needed (especially for dev)
import cors from "cors";
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
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
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("System Check: OK");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });