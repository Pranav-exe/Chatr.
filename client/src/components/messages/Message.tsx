import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation, { MessageType } from "../../zustand/useConversation";

interface MessageProps {
	message: MessageType;
}

const Message = ({ message }: MessageProps) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser?._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser?.profilePic : selectedConversation?.profilePic;
	// High-contrast dual-tone bubble system
	const bubbleClasses = fromMe
		? "chat-bubble-me text-white font-medium rounded-2xl rounded-tr-none px-5 py-3 shadow-xl"
		: "chat-bubble-other text-white/90 rounded-2xl rounded-tl-none px-5 py-3 shadow-lg";

	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName} mb-4 group animate-fade-in`}>
			<div className='chat-image avatar'>
				<div className='w-10 h-10 rounded-full border border-white/10 transition-all duration-300 group-hover:border-[#00f5ff]/30 bg-white/5 animate-pulse overflow-hidden'>
					<img
						alt='Avatar'
						src={profilePic}
						className='w-full h-full object-cover opacity-0 transition-opacity duration-300'
						onLoad={(e) => {
							const target = e.target as HTMLImageElement;
							target.parentElement?.classList.remove('animate-pulse');
							target.classList.remove('opacity-0');
						}}
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							if (!target.dataset.retried) {
								target.dataset.retried = "true";
								const userObj = fromMe ? authUser : selectedConversation;
								const normalizedSeed = encodeURIComponent(userObj?.username?.replace(/\s+/g, "_") || "default");
								const gender = userObj?.gender === "female" ? "female" : "male";
								target.src = gender === "male"
									? `https://api.dicebear.com/9.x/avataaars/svg?seed=${normalizedSeed}&top=shortRound,theCaesar,shortWaved,sides,shortFlat,shavedSides&backgroundType=solid&backgroundColor=4a5568,2d3748,4a4458,2c3e50,34495e,7f8c8d,1a202c,2d3748`
									: `https://api.dicebear.com/9.x/avataaars/svg?seed=${normalizedSeed}&top=longButNotTooLong,straight01,straight02,bigHair,bob,curly,curvy,dreads&backgroundType=solid&backgroundColor=4a5568,4a4458,2c3e50,34495e,7f8c8d,1a202c,2d3748&mouth=smile,default&eyebrows=default`;
							} else {
								target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fromMe ? authUser?.fullName || "" : selectedConversation?.fullName || "")}&background=random`;
							}
							target.parentElement?.classList.remove('animate-pulse');
							target.classList.remove('opacity-0');
						}}
					/>
				</div>
			</div>

			<div className='flex flex-col gap-1.5 max-w-[85%] md:max-w-[75%]'>
				<div className={`chat-bubble min-h-0 bg-transparent p-0 shadow-none ${shakeClass}`}>
					<div className={`text-[0.95rem] leading-relaxed font-bold ${bubbleClasses} break-words whitespace-pre-wrap`}>
						{message.message}
					</div>
				</div>
				<div className={`chat-footer opacity-60 text-[9px] flex gap-2 items-center px-2 font-black uppercase tracking-[0.3em] mt-2 ${fromMe ? 'justify-end text-[#ccff00]' : 'justify-start text-white/60'}`}>
					{formattedTime}
					{fromMe && <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00]"></div>}
				</div>
			</div>
		</div>
	);
};
export default Message;
