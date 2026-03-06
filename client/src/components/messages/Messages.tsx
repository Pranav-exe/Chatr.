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
		<div className='px-4 flex-1 overflow-auto custom-scrollbar'>
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
				<div className='flex flex-col items-center justify-center h-full opacity-30 animate-fade-in'>
					<div className='w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4 border border-white/5'>
						<TiMessages className='text-3xl text-volt/40' />
					</div>
					<p className='text-center text-sm font-medium tracking-tight text-white/60'>
						Start a conversation with {selectedConversation?.fullName.split(" ")[0]}
					</p>
					<p className='text-center text-[10px] mt-1 text-white/20 uppercase tracking-[0.2em] font-bold'>
						Encrypted & Private
					</p>
				</div>
			)}
		</div>
	);
};
export default Messages;
