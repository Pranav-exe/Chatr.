import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import toast from "react-hot-toast";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const { socket } = useSocketContext();

  const logout = async () => {
    setLoading(true);

    try {
      // 🚀 Snap-Disconnect: Kill the socket instantly so other users see us go offline immediately
      if (socket) {
        socket.disconnect();
      }

      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Logout failed");
      }

      localStorage.removeItem("chat-user");
      setAuthUser(null);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;