import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";

interface DecodedToken extends JwtPayload {
  userId: string;
}

// Extend Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const decoded = jwt.verify(token, secret) as DecodedToken;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      // User not found → clear cookie so frontend doesn’t think we’re logged in
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
      });
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error("Error in protectRoute middleware:", error.message || error);

    // Clear cookie if JWT is invalid
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict",
    });

    return res.status(401).json({ error: "Unauthorized - Invalid Token" });
  }
};

export default protectRoute;
