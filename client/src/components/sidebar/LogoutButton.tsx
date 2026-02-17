import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
	const { loading, logout } = useLogout();

	return (
		<div className='mt-auto pt-4'>
			{!loading ? (
				<BiLogOut className='w-6 h-6 text-white/40 hover:text-electric cursor-pointer transition-colors duration-300' onClick={logout} />
			) : (
				<span className='loading loading-spinner loading-sm text-electric'></span>
			)}
		</div>
	);
};
export default LogoutButton;
