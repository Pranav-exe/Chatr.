import React, { ReactNode } from "react";
import { useAuthContext } from "../context/AuthContext";
import useLogout from "../hooks/useLogout";
import { Link } from "react-router-dom";
import Logo from "./Logo";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { authUser } = useAuthContext();
    const { logout } = useLogout();

    return (
        <div className="layout-wrapper relative selection:bg-[#ccff00] selection:text-black">
            {/* Dynamic Background */}
            <div className="bg-vibe">
                <div className="stars-pulsar"></div>
                <div className="shooting-star"></div>
                <div className="shooting-star"></div>
                <div className="shooting-star"></div>
                <div className="volt-glow top-0 left-0"></div>
                <div className="volt-glow bottom-0 right-0 opacity-50"></div>
            </div>

            {/* Header */}
            <header className="h-16 md:h-20 px-6 md:px-10 flex items-center justify-between z-50">
                <Link to="/" className="flex items-center gap-4 group">
                    <Logo className="w-10 h-10 md:w-12 md:h-12" />
                    <span className="text-2xl md:text-3xl font-[900] tracking-tighter uppercase text-white">
                        CHATR<span className="text-[#ccff00]">.</span>
                    </span>
                </Link>

                {authUser && (
                    <div className="flex items-center gap-4 animate-fade">
                        <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00]"></div>
                            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
                                {authUser.username}
                            </span>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="main-content">
                {children}
            </main>

            {/* Global Creator Footer */}
            <footer className="h-16 w-full flex items-center justify-center border-t border-white/[0.02] bg-black/10 backdrop-blur-sm">
                <div className="flex items-center gap-8">
                    <span className="text-[9px] font-black tracking-[0.6em] text-white uppercase opacity-40">
                        CHATR<span className="text-[#ccff00]">.</span>
                    </span>
                    <div className="w-[1px] h-3 bg-white/10"></div>
                    <span className="text-[9px] font-bold tracking-[0.6em] text-white/20 uppercase transition-all duration-500 hover:text-[#ccff00] hover:opacity-100 cursor-default">
                        Crafted by Pranav Sharma
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
