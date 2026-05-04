import { useMemo } from "react";
import { useSocketContext } from "../../context/SocketContext";
import useConversation, { ConversationType } from "../../zustand/useConversation";

interface ConversationProps {
	conversation: ConversationType;
	lastIdx: boolean;
	emoji: string;
}

const Conversation = ({ conversation, lastIdx, emoji }: ConversationProps) => {
	const { selectedConversation, setSelectedConversation, unreadCounts, clearUnreadCount, searchQuery } = useConversation();
	const unreadCount = unreadCounts[conversation._id] || 0;

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);

	// Memoize emoji to prevent "flashing" on re-renders
	const stableEmoji = useMemo(() => emoji, []);

	const highlightMatch = (text: string, query: string) => {
		if (!query) return text;
		const parts = text.split(new RegExp(`(${query})`, "gi"));
		return (
			<span>
				{parts.map((part, i) =>
					part.toLowerCase() === query.toLowerCase() ? (
						<span key={i} className="text-volt font-bold underline underline-offset-2">
							{part}
						</span>
					) : (
						part
					),
				)}
			</span>
		);
	};

	const handleClick = () => {
		setSelectedConversation(conversation);
		clearUnreadCount(conversation._id);
	};

	return (
		<div className="relative group mb-1">
			<div
				className="flex gap-4 items-center p-4 cursor-pointer relative transition-all duration-300"
				onClick={handleClick}
			>
				{/* ⚡ Volt Indicator - High-contrast stable indicator */}
				<div 
					className={`absolute left-0 w-[3px] rounded-r-full bg-[#ccff00] transition-all duration-300 ease-out
						${isSelected ? "h-6 opacity-100" : "h-0 opacity-0 group-hover:h-4 group-hover:opacity-50"}
					`}
				/>

				{/* Avatar Container */}
				<div className="relative pointer-events-none ml-2">
					<div className="w-12 h-12 rounded-full border border-white/5 bg-white/5 overflow-hidden">
						<img
							src={conversation.profilePic}
							alt='user avatar'
							className='w-full h-full object-cover opacity-0 transition-opacity duration-300'
							onLoad={(e) => {
								const target = e.target as HTMLImageElement;
								target.classList.remove('opacity-0');
							}}
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								if (!target.dataset.retried) {
									target.dataset.retried = "true";
									const normalizedSeed = encodeURIComponent(conversation.username.replace(/\s+/g, "_"));
									const gender = conversation.gender === "female" ? "female" : "male";
									target.src = gender === "male"
										? `https://api.dicebear.com/9.x/avataaars/svg?seed=${normalizedSeed}&top=shortRound,theCaesar,shortWaved,sides,shortFlat,shavedSides&backgroundType=solid&backgroundColor=4a5568,2d3748,4a4458,2c3e50,34495e,7f8c8d,1a202c,2d3748`
										: `https://api.dicebear.com/9.x/avataaars/svg?seed=${normalizedSeed}&top=longButNotTooLong,straight01,straight02,bigHair,bob,curly,curvy,dreads&backgroundType=solid&backgroundColor=4a5568,4a4458,2c3e50,34495e,7f8c8d,1a202c,2d3748`;
								} else {
									target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.fullName)}&background=random`;
								}
								target.classList.remove('opacity-0');
							}}
						/>
					</div>
					{isOnline && (
						<div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#ccff00] rounded-full border-[2.5px] border-[#0a0a0b] shadow-[0_0_10px_rgba(204,255,0,0.5)]"></div>
					)}
				</div>

				{/* Info Container */}
				<div className='flex flex-col flex-1 min-w-0 pointer-events-none'>
					<div className='flex justify-between items-center'>
						<p className={`font-bold text-[1rem] truncate tracking-tight transition-colors duration-300 ${isSelected ? "text-white" : "text-white/60 group-hover:text-white/80"}`}>
							{highlightMatch(conversation.fullName, searchQuery)}
						</p>
						<span className={`text-xl transition-all duration-500 ease-out 
							${isSelected ? "grayscale-0 scale-110" : "grayscale group-hover:grayscale-0 group-hover:scale-125"}
							group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]
						`}>
							{stableEmoji}
						</span>
					</div>
				</div>

				{/* Unread Indicator */}
				{unreadCount > 0 && (
					<div className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.5)] mr-2" />
				)}
			</div>
		</div>
	);
};
export default Conversation;
