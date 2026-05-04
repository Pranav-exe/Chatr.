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
		<form onSubmit={handleSubmit} className='flex items-center gap-4 px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl group hover:bg-white/[0.05] hover:border-white/20 focus-within:border-[#ccff00]/50 focus-within:bg-white/[0.06] transition-all duration-300 shadow-lg hover:shadow-[#ccff00]/5'>
			<IoSearchSharp className='w-5 h-5 text-white/20 group-hover:text-white/40 group-focus-within:text-[#ccff00] transition-colors shrink-0' />
			<input
				type='text'
				placeholder='Search friends...'
				className='bg-transparent border-none outline-none w-full text-sm text-white placeholder:text-white/20'
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
		</form>
	);
};
export default SearchInput;
