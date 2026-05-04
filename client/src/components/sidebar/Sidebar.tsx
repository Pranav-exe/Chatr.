import Conversations from "./Conversations";
import UserProfile from "./UserProfile";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<div className='flex flex-col w-full h-full bg-transparent border-r border-white/[0.05] relative z-20'>
			<div className='px-6 py-8 flex-1 flex flex-col min-h-0'>
				<SearchInput />
				
				<div className="flex items-center gap-4 mt-10 mb-4">
					<div className="flex-1 h-[1px] bg-white/[0.06]"></div>
					<p className="text-[9px] font-black tracking-[0.5em] text-white/40 uppercase whitespace-nowrap">Chats</p>
					<div className="flex-1 h-[1px] bg-white/[0.06]"></div>
				</div>

				<div className='flex-1 overflow-y-auto scrollbar-hide'>
					<Conversations />
				</div>
				
				<div className="mt-auto pt-6">
					<UserProfile />
				</div>
			</div>
		</div>
	);
};
export default Sidebar;
