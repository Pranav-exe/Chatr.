import React, { FormEvent, useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
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
						onChange={(e) => setMessage(e.target.value)}
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
