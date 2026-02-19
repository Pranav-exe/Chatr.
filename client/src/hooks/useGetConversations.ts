import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const { conversations, setConversations } = useConversation();

  useEffect(() => {
    const controller = new AbortController();

    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users", {
          credentials: "include",
          signal: controller.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch conversations");
        }

        setConversations(data);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getConversations();

    return () => controller.abort();
  }, [setConversations]);

  return { loading, conversations };
};

export default useGetConversations;
