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
	// Telegram/Discord inspired premium bubbles
	const bubbleClasses = fromMe
		? "bg-volt/10 border border-volt/20 text-white rounded-2xl rounded-tr-none px-4 py-2.5 shadow-lg volt-glow-sm"
		: "bg-white/[0.05] border border-white/5 text-white/95 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-md";

	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName} mb-3 group animate-fade-in`}>
			<div className='chat-image avatar'>
				<div className='w-9 rounded-full border border-white/10 transition-all duration-300 group-hover:border-volt/30'>
					<img alt='Avatar' src={profilePic} className='rounded-full' />
				</div>
			</div>

			<div className='flex flex-col gap-1 max-w-[80%]'>
				<div className={`chat-bubble min-h-0 bg-transparent p-0 shadow-none ${shakeClass}`}>
					<div className={`text-[0.95rem] leading-relaxed font-[450] ${bubbleClasses}`}>
						{message.message}
					</div>
				</div>
				<div className={`chat-footer opacity-40 text-[11px] flex gap-1 items-center px-1 font-medium ${fromMe ? 'justify-end text-volt/60' : 'justify-start text-white/40'}`}>
					{formattedTime}
				</div>
			</div>
		</div>
	);
};
export default Message;
