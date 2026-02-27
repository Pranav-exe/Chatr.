import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const { conversations, setConversations } = useConversation();
  const { setAuthUser } = useAuthContext();

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
          if (res.status === 401) {
            setAuthUser(null);
            throw new Error("Session expired. Please log in again.");
          }
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
