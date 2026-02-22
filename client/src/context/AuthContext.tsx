import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

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

const getInitialUser = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem("chat-user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(getInitialUser());

  useEffect(() => {
    if (authUser) {
      localStorage.setItem("chat-user", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("chat-user");
    }
  }, [authUser]);

  const value = useMemo(() => ({ authUser, setAuthUser }), [authUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};