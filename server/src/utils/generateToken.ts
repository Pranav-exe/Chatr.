import jwt from "jsonwebtoken";
import { Response } from "express";
import mongoose from "mongoose";

const generateTokenAndSetCookie = (
  userId: mongoose.Types.ObjectId,
  res: Response,
): void => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign({ userId: userId.toString() }, secret, {
    expiresIn: "1d",
  });

  const isDev = process.env.NODE_ENV === "development";

  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true, // cannot be accessed by JS
    sameSite: isDev ? "lax" : "strict",
    secure: !isDev, // only HTTPS in prod
  });
};

export default generateTokenAndSetCookie;
