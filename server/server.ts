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

const __dirname = path.resolve();
const PORT: string | number = process.env.PORT || 5001;

// Middlewares
app.use(morgan("dev")); // Request logging
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// DevOps Health Check
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

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Listening on port: ${PORT}`);
  console.log(
    ` Environment: ${process.env.NODE_ENV || "development"}`,
  );
  console.log(`system Check: OK`);
});
