import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import useConversation, { MessageType } from "../zustand/useConversation";
import { notificationService } from "../services/notificationService";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const {
    addMessage,
    selectedConversation,
    incrementUnreadCount,
    setTypingUser,
    removeTypingUser,
    addConversation,
    updateConversation,
  } = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: MessageType) => {
      // Logic for playing notification sound
      const isFromOtherUser = newMessage.senderId !== authUser?._id;
      const isNotInActiveChat =
        selectedConversation?._id !== newMessage.senderId;
      const isAppHidden = document.visibilityState === "hidden";

      if (isFromOtherUser) {
        newMessage.shouldShake = true;

        // Only play sound if user is not looking at the chat or the app is hidden
        if (isNotInActiveChat || isAppHidden) {
          notificationService.play();
        }
      }

      if (selectedConversation?._id === newMessage.senderId) {
        addMessage(newMessage);
      } else if (isFromOtherUser) {
        // Only increment unread if it's NOT from me
        incrementUnreadCount(newMessage.senderId);
      }
    };

    const handleTyping = ({ senderId }: { senderId: string }) => {
      if (selectedConversation?._id === senderId) {
        setTypingUser(senderId);
      }
    };

    const handleStopTyping = ({ senderId }: { senderId: string }) => {
      removeTypingUser(senderId);
    };

    const handleNewUser = (newUser: any) => {
      addConversation(newUser);
    };

    const handleUserStatusUpdate = ({
      userId,
      lastSeen,
    }: {
      userId: string;
      isOnline: boolean;
      lastSeen: string;
    }) => {
      updateConversation(userId, { lastSeen });
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    socket.on("newUser", handleNewUser);
    socket.on("userStatusUpdate", handleUserStatusUpdate);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("newUser", handleNewUser);
      socket.off("userStatusUpdate", handleUserStatusUpdate);
    };
  }, [
    socket,
    selectedConversation,
    addMessage,
    incrementUnreadCount,
    setTypingUser,
    removeTypingUser,
    addConversation,
    updateConversation,
    authUser,
  ]);
};

export default useListenMessages;
