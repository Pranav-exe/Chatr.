import Conversations from "./Conversations";
import UserProfile from "./UserProfile";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<div className='flex flex-col w-full h-full glass-sidebar'>
			<div className='px-5 py-6 h-full flex flex-col'>
				<SearchInput />
				<div className='divider h-1 my-6 before:bg-white/5 after:bg-white/5'></div>
				<Conversations />
				<UserProfile />
			</div>
		</div>
	);
};
export default Sidebar;
