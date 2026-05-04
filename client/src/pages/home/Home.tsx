import { motion } from "framer-motion";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useListenMessages from "../../hooks/useListenMessages";
import useConversation from "../../zustand/useConversation";

const Home = () => {
	const { selectedConversation } = useConversation();
	useListenMessages();

	return (
		<div className='flex h-full w-full overflow-hidden glass-panel z-10 relative animate-fade'>
			<div className={`${selectedConversation ? "hidden md:flex" : "flex"} w-full md:w-[350px] lg:w-[400px] border-r border-white/5`}>
				<Sidebar />
			</div>
			<div className={`${!selectedConversation ? "hidden md:flex" : "flex"} flex-1 bg-white/[0.01]`}>
				<MessageContainer />
			</div>
		</div>
	);
};
export default Home;
