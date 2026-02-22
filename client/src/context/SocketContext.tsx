import { createContext, useState, useEffect, useContext, ReactNode, useMemo } from "react";
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
    if (!authUser) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }

    const socketUrl =
      window.location.port === "5173" || window.location.port === "3000"
        ? "http://localhost:5001"
        : window.location.origin;

    const newSocket = io(socketUrl, {
      query: { userId: authUser._id },
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.close();
      setSocket(null);
    };
  }, [authUser]);

  const value = useMemo(() => ({ socket, onlineUsers }), [socket, onlineUsers]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};