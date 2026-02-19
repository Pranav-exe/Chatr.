import React, { FormEvent, useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();
	const { socket } = useSocketContext();
	const { selectedConversation } = useConversation();
	const [typing, setTyping] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
		if (socket && selectedConversation) {
			socket.emit("stopTyping", { receiverId: selectedConversation._id });
			setTyping(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);

		if (!socket || !selectedConversation) return;

		if (!typing) {
			setTyping(true);
			socket.emit("typing", { receiverId: selectedConversation._id });
		}

		// stop typing timeout
		const lastTypingTime = new Date().getTime();
		const timerLength = 3000;
		setTimeout(() => {
			const timeNow = new Date().getTime();
			const timeDiff = timeNow - lastTypingTime;
			if (timeDiff >= timerLength && typing) {
				socket.emit("stopTyping", { receiverId: selectedConversation._id });
				setTyping(false);
			}
		}, timerLength);
	};

	return (
		<form className='px-6 py-4 mt-auto' onSubmit={handleSubmit}>
			<div className='w-full relative flex items-center gap-3'>
				<div className='relative flex-1 group'>
					<input
						type='text'
						className='w-full input h-14 px-6 text-[0.95rem] font-medium'
						placeholder='Draft a secure message...'
						value={message}
						onChange={handleInputChange}
					/>
				</div>
				<button
					type='submit'
					className='btn btn-primary h-14 w-14 rounded-2xl flex items-center justify-center p-0 transition-all duration-300'
					disabled={loading}
				>
					{loading ? <div className='loading loading-spinner text-black'></div> : <BsSend className='w-5 h-5' />}
				</button>
			</div>
		</form>
	);
};
export default MessageInput;
