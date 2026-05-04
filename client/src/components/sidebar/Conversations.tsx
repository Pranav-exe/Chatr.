import useGetConversations from "../../hooks/useGetConversations";
import useConversation, { ConversationType } from "../../zustand/useConversation";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";
import ConversationSkeleton from "../skeletons/ConversationSkeleton";

const Conversations = () => {
	const { loading } = useGetConversations();
	const { conversations, searchQuery } = useConversation();

	const filteredConversations = conversations.filter((c: ConversationType) =>
		c.fullName.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className='py-2 flex flex-col overflow-auto scrollbar-hide'>
			{filteredConversations.map((conversation: ConversationType, idx: number) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === filteredConversations.length - 1}
				/>
			))}

			{loading ? [...Array(4)].map((_, idx) => <ConversationSkeleton key={idx} />) : null}
			{!loading && filteredConversations.length === 0 && (
				<p className='text-center text-white/20 mt-10 text-xs uppercase font-bold tracking-widest'>No friends found</p>
			)}
		</div>
	);
};
export default Conversations;
