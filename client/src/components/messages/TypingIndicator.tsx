const TypingIndicator = () => {
    return (
        <div className='flex items-center gap-1.5 px-4 py-2 animate-fade-in'>
            <div className='flex gap-1 bg-white/[0.03] border border-white/5 rounded-2xl px-3 py-2'>
                <span className='typing-dot'></span>
                <span className='typing-dot'></span>
                <span className='typing-dot'></span>
            </div>
            <span className='text-[10px] text-white/40 font-medium tracking-tight uppercase'>User is typing...</span>
        </div>
    );
};

export default TypingIndicator;
