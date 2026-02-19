import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

import useListenMessages from "../../hooks/useListenMessages";
import ConversationSkeleton from "../skeletons/ConversationSkeleton";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();
	useListenMessages();
	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
				/>
			))}

			{loading ? [...Array(4)].map((_, idx) => <ConversationSkeleton key={idx} />) : null}
		</div>
	);
};
export default Conversations;
