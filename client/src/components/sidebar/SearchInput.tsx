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
					className='w-full input h-12 pl-12 pr-4 text-[0.85rem] font-medium tracking-tight bg-white/[0.02] border-white/5 group-focus-within:border-volt/20 group-focus-within:bg-white/[0.04]'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<IoSearchSharp className='absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/10 group-focus-within:text-volt transition-all duration-500' />
			</div>
		</form>
	);
};
export default SearchInput;
