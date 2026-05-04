import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useConversation, { MessageType } from "../../zustand/useConversation";
import { TiMessages } from "react-icons/ti";

const Messages = () => {
	const { messages, selectedConversation } = useConversation();
	const { loading: isLoading } = useGetMessages();
	const lastMessageRef = useRef<HTMLDivElement>(null);

	// Use values from the hook but let the store handle state
	const displayMessages = messages || [];

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}, 100);
	}, [displayMessages]);

	return (
		<div className='px-4 flex-1 overflow-auto scrollbar-hide pb-4'>
			{!isLoading &&
				displayMessages.length > 0 &&
				displayMessages.map((message: MessageType) => (
					<div key={message._id}>
						<Message message={message} />
					</div>
				))}

			<div ref={lastMessageRef} />

			{isLoading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{!isLoading && displayMessages.length === 0 && (
				<div className='flex flex-col items-center pt-20 animate-fade-in'>
					{/* Chat Origin Info */}
					<div className="flex flex-col items-center mb-8">
						<div className="w-20 h-20 rounded-full border border-white/10 p-1 mb-4 bg-white/5">
							<img 
								src={selectedConversation?.profilePic} 
								className="w-full h-full object-cover rounded-full opacity-40"
								alt=""
							/>
						</div>
						<p className='text-center text-xs font-black uppercase tracking-[0.4em] text-white/40'>
							Say hi to <span className="text-white/60">{selectedConversation?.fullName.split(" ")[0]}</span> 👋!
						</p>
					</div>

					{/* System Privacy Pill */}
					<div className="px-4 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center gap-2">
						<div className="w-1 h-1 rounded-full bg-[#ccff00]/40"></div>
						<p className="text-[9px] text-white/50 font-bold uppercase tracking-[0.3em]">
							Secure & Encrypted
						</p>
					</div>
				</div>
			)}
		</div>
	);
};
export default Messages;
