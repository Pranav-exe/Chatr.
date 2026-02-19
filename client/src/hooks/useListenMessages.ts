import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import useConversation, { MessageType } from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const {
    addMessage,
    selectedConversation,
    incrementUnreadCount,
    setTypingUser,
    removeTypingUser,
  } = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: MessageType) => {
      // If the message is from me, don't play sound or shake (handled locally in useSendMessage)
      // But we still call addMessage just in case it's from another tab
      if (newMessage.senderId !== authUser?._id) {
        newMessage.shouldShake = true;
        const sound = new Audio(notificationSound);
        sound.play();
      }

      if (selectedConversation?._id === newMessage.senderId) {
        addMessage(newMessage);
      } else if (newMessage.senderId !== authUser?._id) {
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

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [
    socket,
    selectedConversation,
    addMessage,
    incrementUnreadCount,
    setTypingUser,
    removeTypingUser,
    authUser,
  ]);
};

export default useListenMessages;
