import React from "react";

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
	return (
		<div className={`relative ${className}`}>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full h-full drop-shadow-[0_0_12px_rgba(204,255,0,0.5)]"
			>
				{/* The Obsidian Bubble Body */}
				<path
					d="M21 15C21 16.1046 20.1046 17 19 17H7L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z"
					fill="rgba(204, 255, 0, 0.03)"
					stroke="#ccff00"
					strokeWidth="2"
					strokeLinejoin="round"
				/>
				
				{/* Signal/Message Lines */}
				<path
					d="M8 8H16"
					stroke="#ccff00"
					strokeWidth="2"
					strokeLinecap="round"
					strokeOpacity="0.4"
				/>
				<path
					d="M8 12H13"
					stroke="#ccff00"
					strokeWidth="2"
					strokeLinecap="round"
					strokeOpacity="0.4"
				/>
				
				{/* The Brand 'Node' Dot */}
				<circle cx="16" cy="12" r="2" fill="#ccff00" className="animate-pulse" />
			</svg>
		</div>
	);
};

export default Logo;
