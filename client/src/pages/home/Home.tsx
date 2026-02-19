import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useListenMessages from "../../hooks/useListenMessages";
import useConversation from "../../zustand/useConversation";

const Home = () => {
	const { selectedConversation } = useConversation();
	useListenMessages();
	return (
		<div className='relative w-full h-screen p-4 flex items-center justify-center overflow-hidden'>
			<div className='blob blob-primary'></div>
			<div className='blob blob-secondary'></div>

			<div className='flex h-[calc(100vh-2rem)] w-full max-w-screen-2xl rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden glass-panel volt-glow-sm shadow-2xl animate-fade-in z-10 relative'>
				<div className={`${selectedConversation ? "hidden md:flex" : "flex"} w-full md:w-[350px] lg:w-[400px] transition-all duration-300 border-r border-white/5`}>
					<Sidebar />
				</div>
				<div className={`${!selectedConversation ? "hidden md:flex" : "flex"} flex-1 transition-all duration-300`}>
					<MessageContainer />
				</div>
			</div>
		</div>
	);
};
export default Home;
