import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();

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
					<div className='secondary-glass px-6 py-4 flex items-center gap-3 z-10'>
						<div className='w-10 h-10 rounded-full border border-white/10'>
							<img src={selectedConversation.profilePic} alt='' className='rounded-full' />
						</div>
						<div className='flex flex-col'>
							<span className='text-white font-semibold tracking-tight leading-tight'>{selectedConversation.fullName}</span>
							<span className='text-[10px] text-volt/60 font-bold uppercase tracking-widest'>Secure Channel</span>
						</div>
					</div>
					<Messages />
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
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-volt/[0.02] rounded-full blur-[120px]'></div>
			<div className='p-8 text-center flex flex-col items-center gap-6 animate-slide-up z-10'>
				<div className='flex flex-col gap-2'>
					<p className='text-3xl tracking-tighter font-light text-white/40'>Welcome to</p>
					<h2 className='text-6xl font-[900] tracking-tighter uppercase brand-font'>
						CHATR<span className='text-volt'>.</span>
					</h2>
				</div>
				<div className='h-[1px] w-12 bg-white/10'></div>
				<p className='text-white/30 text-[11px] font-semibold tracking-[0.3em] uppercase'>Initialize a secure connection</p>
				<div className='p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 mt-4 transition-all duration-700 hover:border-volt/20 hover:bg-white/[0.04]'>
					<TiMessages className='text-6xl text-white/10' />
				</div>
			</div>
		</div>
	);
};
