import { useSocketContext } from "../../context/SocketContext";
import useConversation, { ConversationType } from "../../zustand/useConversation";

interface ConversationProps {
	conversation: ConversationType;
	lastIdx: boolean;
	emoji: string;
}

const Conversation = ({ conversation, lastIdx, emoji }: ConversationProps) => {
	const { selectedConversation, setSelectedConversation, unreadCounts, clearUnreadCount } = useConversation();
	const unreadCount = unreadCounts[conversation._id] || 0;

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);

	const handleClick = () => {
		setSelectedConversation(conversation);
		clearUnreadCount(conversation._id);
	};

	return (
		<>
			<div
				className={`flex gap-4 items-center hover:bg-white/[0.04] rounded-2xl p-3 cursor-pointer transition-all duration-300 group relative
				${isSelected ? "bg-white/[0.06] border border-white/5 volt-glow-sm" : "border border-transparent"}
			`}
				onClick={handleClick}
			>
				<div className={`avatar ${isOnline ? "online" : "offline"}`}>
					<div className='w-11 h-11 rounded-full border border-white/10 group-hover:border-volt/40 transition-all duration-300 ring-2 ring-transparent group-hover:ring-volt/10 bg-white/5 animate-pulse overflow-hidden'>
						<img
							src={conversation.profilePic}
							alt='user avatar'
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
									const normalizedSeed = encodeURIComponent(conversation.username.replace(/\s+/g, "_"));
									const gender = conversation.gender === "female" ? "female" : "male";
									target.src = gender === "male"
										? `https://api.dicebear.com/9.x/avataaars/svg?seed=${normalizedSeed}&top=shortRound,theCaesar,shortWaved,sides,shortFlat,shavedSides&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,a1c4fd,c2e9fb,8fd3f4,a6c0fe,d4fc79,96e6a1,84fab0,e0c3fc,8ec5fc`
										: `https://api.dicebear.com/9.x/avataaars/svg?seed=${normalizedSeed}&top=longButNotTooLong,straight01,straight02,bigHair,bob,curly,curvy,dreads&backgroundType=gradientLinear&backgroundColor=ffdfbf,ffd5dc,d1d4f9,ff9a9e,fecfef,fbc2eb,a18cd1,f68084,fccb90,d57eeb,fad0c4,ffecd2`;
								} else {
									target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.fullName)}&background=random`;
								}
								target.parentElement?.classList.remove('animate-pulse');
								target.classList.remove('opacity-0');
							}}
						/>
					</div>
				</div>

				<div className='flex flex-col flex-1 min-w-0'>
					<div className='flex justify-between items-center'>
						<p className={`font-semibold text-[0.92rem] truncate tracking-tight transition-colors ${isSelected ? "text-volt" : "text-white/80 group-hover:text-white"}`}>
							{conversation.fullName}
						</p>
						<span className='text-lg grayscale group-hover:grayscale-0 transition-all duration-300'>{emoji}</span>
					</div>
					{unreadCount > 0 && (
						<div className='flex items-center gap-1 animate-fade-in mt-1'>
							<span className='text-[10px] font-bold text-volt tracking-wider uppercase animate-pulse'>+ New Message</span>
							<div className='w-2 h-2 rounded-full bg-volt shadow-[0_0_10px_#ccff00]'></div>
						</div>
					)}
				</div>
			</div>

			{!lastIdx && <div className='divider my-1 opacity-5 before:bg-white after:bg-white px-3' />}
		</>
	);
};
export default Conversation;
