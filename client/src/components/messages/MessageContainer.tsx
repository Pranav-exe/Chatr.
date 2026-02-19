import { useEffect } from "react";
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
	const { selectedConversation, setSelectedConversation, typingUsers } = useConversation();
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(selectedConversation?._id || "");
	const isTyping = typingUsers.includes(selectedConversation?._id || "");

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<div className='flex-1 flex flex-col glass-chat relative h-full overflow-hidden'>
			<div className='chat-pattern'></div>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='secondary-glass px-4 md:px-6 py-4 flex items-center justify-between z-10 shard-header'>
						<div className='flex items-center gap-3'>
							<button onClick={() => setSelectedConversation(null)} className='md:hidden text-white/60 hover:text-white transition-colors p-1'>
								<IoArrowBack size={24} />
							</button>
							<div className='w-11 h-11 rounded-full border border-white/10 p-0.5 glow-volt-subtle'>
								<img src={selectedConversation.profilePic} alt='' className='rounded-full w-full h-full object-cover' />
							</div>
							<div className='flex flex-col'>
								<div className='flex items-center gap-2'>
									<span className='text-white font-bold tracking-tight leading-tight text-lg'>{selectedConversation.fullName}</span>
									<span className='text-xs text-white/30 font-medium tracking-tight mt-0.5 leading-none'>@{selectedConversation.username}</span>
								</div>
								<div className='flex items-center gap-1.5'>
									<div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-volt animate-pulse' : 'bg-white/20'}`}></div>
									<span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-volt opacity-80' : 'text-white/40'}`}>
										{isOnline ? 'Active Session' : `Last seen ${formatLastSeen(selectedConversation.lastSeen)}`}
									</span>
								</div>
							</div>
						</div>
						<div className='hidden sm:block'>
							<div className='px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5'>
								<span className='text-[10px] text-white/40 font-bold uppercase tracking-widest'>Encryption: Peer-to-Peer</span>
							</div>
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
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full relative overflow-hidden'>
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-volt/[0.02] rounded-full blur-[80px] md:blur-[120px]'></div>
			<div className='p-6 md:p-8 text-center flex flex-col items-center gap-4 md:gap-6 animate-slide-up z-10'>
				<div className='flex flex-col gap-1 md:gap-2'>
					<p className='text-2xl md:text-3xl tracking-tighter font-light text-white/40'>Welcome to</p>
					<h2 className='text-4xl md:text-6xl font-[900] tracking-tighter uppercase brand-font'>
						CHATR<span className='text-volt'>.</span>
					</h2>
				</div>
				<div className='h-[1px] w-8 md:w-12 bg-white/10'></div>
				<p className='text-white/30 text-[9px] md:text-[11px] font-semibold tracking-[0.2em] md:tracking-[0.3em] uppercase'>Initialize a secure connection</p>
				<div className='p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 mt-2 md:mt-4 transition-all duration-700 hover:border-volt/20 hover:bg-white/[0.04]'>
					<TiMessages className='text-4xl md:text-6xl text-white/10' />
				</div>
			</div>
		</div>
	);
};
