import React, { FormEvent, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
	const { searchQuery, setSearchQuery, setSelectedConversation, conversations } = useConversation();
	// const { conversations } = useGetConversations();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!searchQuery) return;
		if (searchQuery.length < 3) {
			return toast.error("Search term must be at least 3 characters long");
		}

		const conversation = conversations.find((c) => c.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

		if (conversation) {
			setSelectedConversation(conversation);
			setSearchQuery("");
		} else toast.error("No such user found!");
	};
	return (
		<form onSubmit={handleSubmit} className='flex items-center gap-2'>
			<div className='relative flex-1 group'>
				<input
					type='text'
					placeholder='Search friends...'
					className='w-full input h-12 px-10 text-xs font-medium'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<IoSearchSharp className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-volt transition-colors duration-300' />
			</div>
			{/* <button type='submit' className='btn btn-primary h-12 w-12 min-h-0 rounded-xl flex items-center justify-center p-0'>
				<IoSearchSharp className='w-5 h-5' />
			</button> */}
		</form>
	);
};
export default SearchInput;
