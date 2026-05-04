import { Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user?._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    // ⚡ Calculate unread counts for each user
    const unreadMessages = await Message.find({
      receiverId: loggedInUserId,
      isRead: false,
    });

    const unreadCounts: { [key: string]: number } = {};
    unreadMessages.forEach((m) => {
      const senderId = m.senderId.toString();
      unreadCounts[senderId] = (unreadCounts[senderId] || 0) + 1;
    });

    const usersWithUnread = filteredUsers.map((user) => {
      const userObj = user.toObject();
      return {
        ...userObj,
        unreadCount: unreadCounts[user._id.toString()] || 0,
      };
    });

    res.status(200).json(usersWithUnread);
  } catch (error: any) {
    console.error("Error in getUsersForSidebar:", error.message || error);
    res.status(500).json({ error: "Internal server error" });
  }
};