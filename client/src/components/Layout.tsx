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
                <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="w-10 h-10 rounded-xl logo-symbol flex items-center justify-center text-xl">
                        C
                    </div>
                    <span className="brand-font text-3xl font-[900] tracking-tighter text-white uppercase brand-glow-refined">
                        CHATR<span className="text-volt">.</span>
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

            {/* Footer Attribution */}
            <footer className="w-full flex justify-center items-center py-5 select-none z-10">
                <p className="text-[10px] font-bold tracking-[0.6em] uppercase text-white/10 hover:text-volt/60 transition-all duration-700 cursor-default">
                    Crafted by Pranav Sharma
                </p>
            </footer>
        </div>
    );
};

export default Layout;
