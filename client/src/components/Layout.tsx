import React, { ReactNode } from "react";
import { useAuthContext } from "../context/AuthContext";
import useLogout from "../hooks/useLogout";
import { Link } from "react-router-dom";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { authUser } = useAuthContext();
    const { logout } = useLogout();

    return (
        <div className="min-h-screen w-full flex flex-col bg-transparent text-slate-200">
            {/* Background Decorative Blobs */}
            <div className="blob blob-primary" />
            <div className="blob blob-secondary" />

            {/* Navigation Header */}
            <header className="w-full h-20 glass-panel border-b border-white/5 px-8 flex items-center justify-between z-50">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-xl volt-accent flex items-center justify-center font-black text-black text-xl shadow-[0_0_15px_rgba(204,255,0,0.2)]">
                        C
                    </div>
                    <span className="brand-font text-3xl font-[900] tracking-tighter text-white uppercase">
                        Chatr<span className="volt-text">.</span>
                    </span>
                </Link>

                {authUser && (
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-volt"></div>
                                <span className="text-sm font-bold tracking-tight text-white/90">
                                    {authUser.username}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                {children}
            </main>


        </div>
    );
};

export default Layout;
