import React, { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import useSignup from "../../hooks/useSignup";
import Logo from "../../components/Logo";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const { loading, signup } = useSignup();

	const handleCheckboxChange = (gender: string) => {
		setInputs((prev) => ({
			...prev,
			gender,
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		await signup(inputs);
	};

	return (
		<div className='flex flex-col items-center justify-center w-full max-w-[850px] mx-auto animate-fade z-20 px-6 py-4'>
			<div className='w-full glass-panel relative shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)]'>
				{/* Accent Bar */}
				<div className="h-1.5 w-full bg-[#ccff00] rounded-t-2xl"></div>
				
				<div className='p-6 md:p-8'>
					<div className="flex flex-col items-center mb-6 md:mb-8 text-center">
						<Logo className="w-16 h-16 mb-4" />
						<h1 className='text-2xl md:text-3xl font-black text-white mb-2 tracking-tighter uppercase brand-font'>
							CREATE ACCOUNT<span className='text-[#ccff00]'>.</span>
						</h1>
						<p className="text-[9px] font-bold tracking-[0.5em] text-white/30 uppercase">
							Join the conversation
						</p>
					</div>


					<form onSubmit={handleSubmit} className='space-y-6 relative z-10'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6'>
							<div className='space-y-3'>
								<label className='px-1 block'>
									<span className='text-[10px] font-black text-white/40 tracking-[0.2em] uppercase'>Full Name</span>
								</label>
								<input
									type='text'
									placeholder='enter your name'
									className='w-full input-field h-12 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] text-sm'
									value={inputs.fullName}
									onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
								/>
							</div>
							
							<div className='space-y-3'>
								<label className='px-1 block'>
									<span className='text-[10px] font-black text-white/40 tracking-[0.2em] uppercase'>Username</span>
								</label>
								<input
									type='text'
									placeholder='choose a username'
									className='w-full input-field h-12 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] text-sm'
									value={inputs.username}
									onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
								/>
							</div>

							<div className='space-y-3'>
								<label className='px-1 block'>
									<span className='text-[10px] font-black text-white/40 tracking-[0.2em] uppercase'>Password</span>
								</label>
								<input
									type='password'
									placeholder='••••••••'
									className='w-full input-field h-12 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] text-sm'
									value={inputs.password}
									onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
								/>
							</div>

							<div className='space-y-3'>
								<label className='px-1 block'>
									<span className='text-[10px] font-black text-white/40 tracking-[0.2em] uppercase'>Confirm Password</span>
								</label>
								<input
									type='password'
									placeholder='••••••••'
									className='w-full input-field h-12 bg-white/[0.02] border-white/5 focus:bg-white/[0.04] text-sm'
									value={inputs.confirmPassword}
									onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center border-t border-white/5 pt-6">
							<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
							
							<div className='flex flex-col gap-6'>
								<button
									className='btn-primary w-full h-12 text-[12px] font-black tracking-[0.2em]'
									disabled={loading}
								>
									{loading ? <span className='loading loading-spinner'></span> : "SIGN UP"}
								</button>

								<div className="flex flex-col items-center pt-2">
									<Link
										to='/login'
										className='text-[10px] text-white/40 hover:text-[#ccff00] text-center transition-colors duration-300 font-bold tracking-widest uppercase underline underline-offset-4 decoration-white/10 hover:decoration-[#ccff00]/30'
									>
										Already have an account?
									</Link>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
export default SignUp;
