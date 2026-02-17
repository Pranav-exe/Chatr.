import { createContext, useContext, useState, ReactNode } from "react";

interface AuthUser {
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext must be used within an AuthContextProvider");
	}
	return context;
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	const [authUser, setAuthUser] = useState<AuthUser | null>(JSON.parse(localStorage.getItem("chat-user") || "null"));

	return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};
