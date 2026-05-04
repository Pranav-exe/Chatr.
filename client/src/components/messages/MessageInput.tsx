import React, { FormEvent, useState, useRef } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();
	const { socket } = useSocketContext();
	const { selectedConversation } = useConversation();
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!message) return;

		await sendMessage(message);
		setMessage("");

		if (socket && selectedConversation) {
			socket.emit("stopTyping", { receiverId: selectedConversation._id });
		}
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);

		if (!socket || !selectedConversation) return;

		// ⚡ Emit typing event immediately
		socket.emit("typing", { receiverId: selectedConversation._id });

		// 🧹 Clear previous timeout
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// ⏱️ Set new idle timeout
		typingTimeoutRef.current = setTimeout(() => {
			socket.emit("stopTyping", { receiverId: selectedConversation._id });
		}, 3000);
	};

	return (
		<form className='px-4 md:px-8 py-4 md:py-5 mt-auto relative z-10' onSubmit={handleSubmit}>
			<div className='w-full relative flex items-center gap-5'>
				<div className='relative flex-1 group'>
					<input
						type='text'
						className='w-full input-field h-14 px-8 text-[1rem] shadow-2xl !rounded-2xl'
						placeholder='Send a message...'
						value={message}
						onChange={handleInputChange}
					/>
				</div>
				<button
					type='submit'
					className='btn-primary h-14 w-14 flex items-center justify-center !p-0 !rounded-2xl shadow-2xl transition-all duration-500 relative'
					disabled={loading}
				>
					{loading ? <div className='loading loading-spinner text-black'></div> : <BsSend className='w-4 h-4 -translate-x-[2px] translate-y-[2px]' />}
				</button>
			</div>
		</form>
	);
};
export default MessageInput;
