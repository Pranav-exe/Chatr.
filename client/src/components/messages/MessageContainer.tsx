import { useEffect } from "react";
import { motion } from "framer-motion";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { IoArrowBack } from "react-icons/io5";

import { useSocketContext } from "../../context/SocketContext";
import { formatLastSeen } from "../../utils/formatLastSeen";
import TypingIndicator from "./TypingIndicator";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation, typingUsers } =
		useConversation();
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(selectedConversation?._id || "");
	const isTyping = typingUsers.includes(selectedConversation?._id || "");

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<div className="flex-1 flex flex-col bg-transparent relative h-full overflow-hidden border-l border-white/[0.05]">

			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className="h-20 px-8 flex items-center justify-between border-b border-white/[0.04] bg-transparent backdrop-blur-md z-20">
						<div className="flex items-center gap-5">
							<button
								onClick={() => setSelectedConversation(null)}
								className="md:hidden text-white/30 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
							>
								<IoArrowBack size={24} />
							</button>
							
							<div className="relative group">
								<div className={`w-12 h-12 rounded-2xl border border-white/10 p-0.5 bg-white/5 transition-all duration-500 ${isOnline ? "shadow-[0_0_20px_rgba(204,255,0,0.2)] border-[#ccff00]/30" : ""}`}>
									<img
										src={selectedConversation.profilePic}
										alt=""
										className="w-full h-full object-cover rounded-2xl"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.fullName)}&background=random`;
										}}
									/>
								</div>
								{isOnline && (
									<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#ccff00] rounded-full border-[2.5px] border-[#0a0a0b] shadow-[0_0_10px_#ccff00]"></div>
								)}
							</div>

							<div className="flex flex-col min-w-0">
								<h2 className="text-white font-bold tracking-tight text-lg leading-tight mb-0.5 truncate max-w-[150px] md:max-w-[250px]">
									{selectedConversation.fullName}
								</h2>
								<p className="text-[10px] text-white/60 font-semibold uppercase tracking-[0.2em] truncate">
									@{selectedConversation.username}
								</p>
							</div>
						</div>
						
						<div className="flex items-center gap-2">
							<div className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[#ccff00] shadow-[0_0_8px_#ccff00]" : "bg-white/10"}`}></div>
							<span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isOnline ? "text-[#ccff00]" : "text-white/70"}`}>
								{isOnline ? "Online" : `Last Seen ${selectedConversation.lastSeen ? formatLastSeen(selectedConversation.lastSeen) : "Recently"}`}
							</span>
						</div>
					</div>
					<Messages />
					{isTyping && <TypingIndicator />}
					<MessageInput />
				</>
			)}
		</div>
	);
};

export default MessageContainer;

const NoChatSelected = () => {
	return (
		<div className="flex items-center justify-center w-full h-full bg-transparent relative overflow-hidden">
			<div className="flex flex-col items-center gap-12 animate-fade-in z-10">
				{/* Minimalist Brand Logo */}
				<div className="flex flex-col items-center">
					<h2 className="text-6xl md:text-8xl font-[900] tracking-tighter uppercase brand-font leading-none text-white select-none">
						CHATR<span className="text-[#ccff00]">.</span>
					</h2>
					<div className="w-16 h-[1px] bg-white/10 mt-8"></div>
				</div>
				
				{/* High-End Instructions */}
				<div className="flex flex-col items-center">
					<p className="text-[10px] text-white/40 font-black uppercase tracking-[0.5em] select-none">
						Select a contact to begin
					</p>
				</div>
			</div>
		</div>
	);
};
