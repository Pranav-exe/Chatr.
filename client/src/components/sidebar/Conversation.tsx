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
					<div className='w-11 rounded-full border border-white/10 group-hover:border-volt/40 transition-all duration-300 ring-2 ring-transparent group-hover:ring-volt/10'>
						<img src={conversation.profilePic} alt='user avatar' />
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
