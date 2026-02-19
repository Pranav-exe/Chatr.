import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import { getReceiverSocketId, io } from "../socket/socket";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    if (!senderId) return res.status(401).json({ error: "Unauthorized" });
    if (!message || message.trim() === "") return res.status(400).json({ error: "Message cannot be empty" });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [senderId, receiverId] });
    }

    const newMessage = new Message({ senderId, receiverId, message });
    conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET.IO: send message to receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Optional: send to sender too to update UI immediately
    io.to(senderId.toString()).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error: any) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user?._id;

    if (!senderId) return res.status(401).json({ error: "Unauthorized" });

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    res.status(200).json(conversation.messages);
  } catch (error: any) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};