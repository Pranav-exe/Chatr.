import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Conversation {
  _id: string;
  fullName: string;
  profilePic: string;
}

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users", {
          credentials: "include", // important if auth cookie is used
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
  }, []);

  return { loading, conversations };
};

export default useGetConversations;