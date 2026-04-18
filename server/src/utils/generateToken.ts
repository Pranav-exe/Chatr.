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

  const isHTTPS = process.env.USE_HTTPS === "true";

  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    sameSite: isHTTPS ? "none" : "lax",
    secure: isHTTPS,
  });
};

export default generateTokenAndSetCookie;
