import React, { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import useSignup from "../../hooks/useSignup";

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
		<div className='flex flex-col items-center justify-center min-w-[500px] mx-auto animate-fade-in z-20'>
			<div className='w-full p-10 rounded-[3rem] glass-panel volt-glow-sm shadow-2xl relative overflow-hidden'>

				<div className='absolute -bottom-24 -left-24 w-48 h-48 bg-volt/[0.03] rounded-full blur-3xl'></div>

				<h1 className='text-6xl font-[900] text-center text-white mb-2 tracking-tighter uppercase brand-font'>
					CHATR<span className='text-volt'>.</span>
				</h1>


				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='grid grid-cols-2 gap-5'>
						<div className='space-y-2'>
							<label className='px-1'>
								<span className='text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase'>Full Name</span>
							</label>
							<input
								type='text'
								placeholder='John Doe'
								className='w-full input h-14 px-5 text-sm font-medium'
								value={inputs.fullName}
								onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
							/>
						</div>
						<div className='space-y-2'>
							<label className='px-1'>
								<span className='text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase'>Identity</span>
							</label>
							<input
								type='text'
								placeholder='Username'
								className='w-full input h-14 px-5 text-sm font-medium'
								value={inputs.username}
								onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
							/>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-5'>
						<div className='space-y-2'>
							<label className='px-1'>
								<span className='text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase'>Passkey</span>
							</label>
							<input
								type='password'
								placeholder='••••••••'
								className='w-full input h-14 px-5 text-sm font-medium'
								value={inputs.password}
								onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							/>
						</div>
						<div className='space-y-2'>
							<label className='px-1'>
								<span className='text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase'>Verify</span>
							</label>
							<input
								type='password'
								placeholder='••••••••'
								className='w-full input h-14 px-5 text-sm font-medium'
								value={inputs.confirmPassword}
								onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
							/>
						</div>
					</div>

					<div className='py-2'>
						<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
					</div>

					<div className='pt-2 flex flex-col gap-6'>
						<button
							className='btn btn-primary h-14 w-full rounded-2xl text-[15px]'
							disabled={loading}
						>
							{loading ? <span className='loading loading-spinner'></span> : "INITIALIZE ACCOUNT"}
						</button>

						<Link
							to='/login'
							className='text-[11px] text-white/30 hover:text-volt text-center block transition-all duration-300 font-bold tracking-[0.1em] uppercase'
						>
							Return to login portal
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};
export default SignUp;
