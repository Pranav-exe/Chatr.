import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}, 100);
	}, [messages]);

	return (
		<div className='px-4 flex-1 overflow-auto custom-scrollbar'>
			{!loading &&
				messages.length > 0 &&
				messages.map((message) => (
					<div key={message._id}>
						<Message message={message} />
					</div>
				))}

			<div ref={lastMessageRef} />

			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{!loading && messages.length === 0 && (
				<div className='flex flex-col items-center justify-center h-full opacity-20'>
					<p className='text-center text-sm font-light tracking-widest uppercase'>New connection established</p>
					<p className='text-center text-xs mt-1'>Send a message to start the conversation</p>
				</div>
			)}
		</div>
	);
};
export default Messages;
