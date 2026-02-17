import React from "react";

interface GenderCheckboxProps {
	onCheckboxChange: (gender: string) => void;
	selectedGender: string;
}

const GenderCheckbox = ({ onCheckboxChange, selectedGender }: GenderCheckboxProps) => {
	return (
		<div className='flex gap-6 items-center'>
			<div className='form-control'>
				<label className={`flex items-center gap-2 cursor-pointer transition-all duration-300 group`}>
					<span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${selectedGender === "male" ? "text-volt" : "text-white/20 group-hover:text-white/40"}`}>Identity: M</span>
					<input
						type='checkbox'
						className='checkbox checkbox-xs border-white/20 rounded-md checked:border-volt [--chkbg:#ccff00] [--chkfg:#000000] transition-all duration-300'
						checked={selectedGender === "male"}
						onChange={() => onCheckboxChange("male")}
					/>
				</label>
			</div>
			<div className='form-control'>
				<label className={`flex items-center gap-2 cursor-pointer transition-all duration-300 group`}>
					<span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${selectedGender === "female" ? "text-volt" : "text-white/20 group-hover:text-white/40"}`}>Identity: F</span>
					<input
						type='checkbox'
						className='checkbox checkbox-xs border-white/20 rounded-md checked:border-volt [--chkbg:#ccff00] [--chkfg:#000000] transition-all duration-300'
						checked={selectedGender === "female"}
						onChange={() => onCheckboxChange("female")}
					/>
				</label>
			</div>
		</div>
	);
};
export default GenderCheckbox;

// STARTER CODE FOR THIS FILE
// const GenderCheckbox = () => {
// 	return (
// 		<div className='flex'>
// 			<div className='form-control'>
// 				<label className={`label gap-2 cursor-pointer`}>
// 					<span className='label-text'>Male</span>
// 					<input type='checkbox' className='checkbox border-slate-900' />
// 				</label>
// 			</div>
// 			<div className='form-control'>
// 				<label className={`label gap-2 cursor-pointer`}>
// 					<span className='label-text'>Female</span>
// 					<input type='checkbox' className='checkbox border-slate-900' />
// 				</label>
// 			</div>
// 		</div>
// 	);
// };
// export default GenderCheckbox;
