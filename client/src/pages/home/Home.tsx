import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
	return (
		<div className='relative w-full h-screen p-4 flex items-center justify-center overflow-hidden'>
			<div className='blob blob-primary'></div>
			<div className='blob blob-secondary'></div>

			<div className='flex sm:h-[450px] md:h-[750px] w-full max-w-screen-xl rounded-[2rem] overflow-hidden glass-panel volt-glow-sm shadow-2xl animate-fade-in z-10'>
				<Sidebar />
				<MessageContainer />
			</div>
		</div>
	);
};
export default Home;
