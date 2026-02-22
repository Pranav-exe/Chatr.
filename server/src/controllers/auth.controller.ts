import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import generateTokenAndSetCookie from "../utils/generateToken";
import { io } from "../socket/socket";

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, password, confirmPassword, gender } = req.body;
    const username = req.body.username?.trim();

    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10),
    );

    const normalizedSeed = encodeURIComponent(username.replace(/\s+/g, "_"));
    const profilePic =
      gender === "male"
        ? `https://api.dicebear.com/9.x/avataaars/svg?seed=${normalizedSeed}&top=shortRound,theCaesar,shortWaved,sides,shortFlat,shavedSides&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,a1c4fd,c2e9fb,8fd3f4,a6c0fe,d4fc79,96e6a1,84fab0,e0c3fc,8ec5fc`
        : `https://api.dicebear.com/9.x/avataaars/svg?seed=${normalizedSeed}&top=longButNotTooLong,straight01,straight02,bigHair,bob,curly,curvy,dreads&backgroundType=gradientLinear&backgroundColor=ffdfbf,ffd5dc,d1d4f9,ff9a9e,fecfef,fbc2eb,a18cd1,f68084,fccb90,d57eeb,fad0c4,ffecd2`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic,
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    const userResponse = {
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic,
      gender: newUser.gender,
    };

    // Notify all connected clients about the new user
    io.emit("newUser", userResponse);

    res.status(201).json(userResponse);
  } catch (error: any) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const username = req.body.username?.trim();

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ error: "Invalid username or password" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password" });

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
      gender: user.gender,
    });
  } catch (error: any) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (_req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 0,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
