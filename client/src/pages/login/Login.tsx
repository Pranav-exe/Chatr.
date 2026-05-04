import React, { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import Logo from "../../components/Logo";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className='flex flex-col items-center justify-center w-full max-w-[850px] mx-auto animate-fade z-20 px-6 py-4'>
			<div className='w-full glass-panel relative shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)]'>
				{/* Accent Bar */}
				<div className="h-1.5 w-full bg-[#ccff00] rounded-t-2xl"></div>
				
				<div className='p-8 md:p-12'>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						{/* Left Side: Branding */}
						<div className="flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-white/5 pb-10 md:pb-0 md:pr-12">
							<Logo className="w-20 h-20 mb-6" />
							<h1 className='text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase brand-font leading-none'>
								WELCOME BACK<span className="text-white/40 ml-3">👋</span><span className='text-[#ccff00]'>.</span>
							</h1>
							
							<div className="hidden md:flex flex-col pt-4">
								<Link
									to='/signup'
									className='text-[10px] text-white/40 hover:text-[#ccff00] transition-colors duration-300 font-bold uppercase tracking-widest underline underline-offset-4 decoration-white/10 hover:decoration-[#ccff00]/30'
								>
									Don't have an account?
								</Link>
							</div>
						</div>

						{/* Right Side: Form */}
						<form onSubmit={handleSubmit} className='space-y-6 relative z-10'>
							<div className='space-y-3'>
								<label className='px-1 block'>
									<span className='text-[10px] font-black text-white/40 tracking-[0.2em] uppercase'>Username</span>
								</label>
								<input
									type='text'
									placeholder='enter username'
									className='w-full input-field h-12 bg-[#050505] border-white/5 text-sm'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
							</div>

							<div className='space-y-3'>
								<label className='px-1 block'>
									<span className='text-[10px] font-black text-white/40 tracking-[0.2em] uppercase'>Password</span>
								</label>
								<input
									type='password'
									placeholder='••••••••'
									className='w-full input-field h-12 bg-[#050505] border-white/5 text-sm'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>

							<div className='pt-4'>
								<button
									className='btn-primary w-full h-12 text-[12px] font-black tracking-[0.2em]'
									disabled={loading}
								>
									{loading ? <span className='loading loading-spinner'></span> : "LOG IN"}
								</button>
							</div>

							<div className="md:hidden pt-6 border-t border-white/5 flex flex-col items-center">
								<Link
									to='/signup'
									className='text-[10px] text-white/40 hover:text-[#ccff00] transition-colors duration-300 font-bold uppercase tracking-widest underline underline-offset-4 decoration-white/10 hover:decoration-[#ccff00]/30'
								>
									Don't have an account?
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Login;
