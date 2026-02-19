import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AuthUser {
  _id: string;
  fullName: string;
  username: string;
  profilePic: string;
  gender: string;
}

interface AuthContextType {
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};

const getStoredUser = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem("chat-user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(getStoredUser());

  // Sync with localStorage automatically
  useEffect(() => {
    if (authUser) localStorage.setItem("chat-user", JSON.stringify(authUser));
    else localStorage.removeItem("chat-user");
  }, [authUser]);

  return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};