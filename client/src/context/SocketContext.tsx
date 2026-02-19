import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useAuthContext } from "./AuthContext";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketContextProvider");
  }
  return context;
};

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!authUser) return;

    // Decide URL dynamically: dev vs prod
    const socketUrl =
      window.location.port === "3000"
        ? `${window.location.protocol}//${window.location.hostname}:5001`
        : window.location.origin;

    // Initialize Socket.IO client
    const newSocket = io(socketUrl, {
      query: { userId: authUser._id },
      withCredentials: true, // important for sending cookies/JWT
      transports: ["websocket", "polling"], // ensures stable connection
    });

    setSocket(newSocket);

    // Listen for online users
    newSocket.on("getOnlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    // Optional: listen for errors or connection issues
    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    // Cleanup on unmount or auth change
    return () => {
      newSocket.disconnect();
      setSocket(null);
      setOnlineUsers([]);
    };
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};