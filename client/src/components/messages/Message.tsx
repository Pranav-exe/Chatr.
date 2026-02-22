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
	// Balanced dual-tone system: dimmed volt but still highlighted
	const bubbleClasses = fromMe
		? "bg-volt/30 border border-volt/40 text-white font-medium rounded-2xl rounded-tr-none px-4 py-2.5 shadow-[0_8px_20px_-5px_rgba(204,255,0,0.15)]"
		: "bg-[#1a1a1e] border border-white/10 text-white/95 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-lg relative after:absolute after:inset-0 after:rounded-2xl after:bg-white/[0.02]";

	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName} mb-3 group animate-fade-in`}>
			<div className='chat-image avatar'>
				<div className='w-9 h-9 rounded-full border border-white/10 transition-all duration-300 group-hover:border-volt/30 bg-white/5 animate-pulse overflow-hidden'>
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
									? `https://api.dicebear.com/9.x/avataaars/svg?seed=${normalizedSeed}&top=shortRound,theCaesar,shortWaved,sides,shortFlat,shavedSides&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,a1c4fd,c2e9fb,8fd3f4,a6c0fe,d4fc79,96e6a1,84fab0,e0c3fc,8ec5fc`
									: `https://api.dicebear.com/9.x/avataaars/svg?seed=${normalizedSeed}&top=longButNotTooLong,straight01,straight02,bigHair,bob,curly,curvy,dreads&backgroundType=gradientLinear&backgroundColor=ffdfbf,ffd5dc,d1d4f9,ff9a9e,fecfef,fbc2eb,a18cd1,f68084,fccb90,d57eeb,fad0c4,ffecd2&mouth=smile,default&eyebrows=default`;
							} else {
								target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fromMe ? authUser?.fullName || "" : selectedConversation?.fullName || "")}&background=random`;
							}
							target.parentElement?.classList.remove('animate-pulse');
							target.classList.remove('opacity-0');
						}}
					/>
				</div>
			</div>

			<div className='flex flex-col gap-1 max-w-[80%]'>
				<div className={`chat-bubble min-h-0 bg-transparent p-0 shadow-none ${shakeClass}`}>
					<div className={`text-[0.95rem] leading-relaxed font-[450] ${bubbleClasses}`}>
						{message.message}
					</div>
				</div>
				<div className={`chat-footer opacity-60 text-[10px] flex gap-1 items-center px-1.5 font-bold tracking-tight mt-1 ${fromMe ? 'justify-end text-volt' : 'justify-start text-white/60'}`}>
					{formattedTime}
				</div>
			</div>
		</div>
	);
};
export default Message;
