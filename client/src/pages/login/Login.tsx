import React, { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-[420px] mx-auto animate-fade-in z-20'>
			<div className='w-full p-10 rounded-[2.5rem] glass-panel volt-glow-sm shadow-2xl relative overflow-hidden'>
				{/* Deco subtle glow */}
				<div className='absolute -top-24 -right-24 w-48 h-48 bg-volt/[0.03] rounded-full blur-3xl'></div>

				<h1 className='text-6xl font-[900] text-center text-white mb-2 tracking-tighter uppercase brand-font'>
					CHATR<span className='text-volt'>.</span>
				</h1>
				<p className='text-center text-white/30 text-[11px] mb-12 font-semibold tracking-[0.3em] uppercase'>Initialize Secure Session</p>

				<form onSubmit={handleSubmit} className='space-y-7'>
					<div className='space-y-2'>
						<label className='px-1'>
							<span className='text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase'>User Identity</span>
						</label>
						<input
							type='text'
							placeholder='Enter Username'
							className='w-full input h-14 px-5 text-sm font-medium'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div className='space-y-2'>
						<label className='px-1'>
							<span className='text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase'>Access Key</span>
						</label>
						<input
							type='password'
							placeholder='••••••••••••'
							className='w-full input h-14 px-5 text-sm font-medium'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<div className='pt-2 flex flex-col gap-6'>
						<button
							className='btn btn-primary h-14 w-full rounded-2xl text-[15px]'
							disabled={loading}
						>
							{loading ? <span className='loading loading-spinner'></span> : "AUTHENTICATE"}
						</button>

						<Link
							to='/signup'
							className='text-[11px] text-white/30 hover:text-volt text-center block transition-all duration-300 font-bold tracking-[0.1em] uppercase'
						>
							New User? Create Account
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Login;
