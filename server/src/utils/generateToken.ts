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
    expiresIn: "15d",
  });

  const isDev = process.env.NODE_ENV === "development";

  // res.cookie("jwt", token, {
  //   maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  //   httpOnly: true, // cannot be accessed by JS
  //   sameSite: isDev ? "lax" : "strict", // allow cross-origin in dev
  //   secure: !isDev, // only HTTPS in prod
  // });
// };

res.cookie("jwt", token, {
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  httpOnly: true,
  sameSite: isDev ? "none" : "strict", // allow cross-origin in dev
  secure: !isDev, // only HTTPS in prod
});
};

export default generateTokenAndSetCookie;
