import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<div className='flex flex-col w-1/3 min-w-[320px] glass-sidebar h-full'>
			<div className='px-5 py-6 h-full flex flex-col'>
				<SearchInput />
				<div className='divider h-1 my-6 before:bg-white/5 after:bg-white/5'></div>
				<Conversations />
				<div className='mt-auto pt-4'>
					<LogoutButton />
				</div>
			</div>
		</div>
	);
};
export default Sidebar;
