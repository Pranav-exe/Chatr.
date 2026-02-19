import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation, { MessageType } from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { addMessage, selectedConversation, incrementUnreadCount } =
    useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: MessageType) => {
      newMessage.shouldShake = true;

      const sound = new Audio(notificationSound);
      sound.play();

      if (selectedConversation?._id === newMessage.senderId) {
        addMessage(newMessage);   // ✅ use this
      } else {
        incrementUnreadCount(newMessage.senderId);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConversation, addMessage, incrementUnreadCount]);
};

export default useListenMessages;