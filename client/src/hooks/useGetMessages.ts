import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { MessageType } from "../zustand/useConversation";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    if (!selectedConversation?._id) return;

    const controller = new AbortController();

    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation._id}`, {
          credentials: "include", // for auth cookies
          signal: controller.signal,
        });

        const data: MessageType[] = await res.json();

        if (!res.ok) {
          throw new Error((data as any)?.error || "Failed to fetch messages");
        }

        setMessages(data);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getMessages();

    return () => controller.abort();
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;