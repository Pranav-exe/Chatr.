const ConversationSkeleton = () => {
    return (
        <div className='flex gap-4 items-center p-3 animate-pulse'>
            <div className='skeleton w-11 h-11 rounded-full shrink-0 bg-white/[0.03]'></div>
            <div className='flex flex-col flex-1 gap-2'>
                <div className='skeleton h-3 w-32 bg-white/[0.03] rounded-lg'></div>
                <div className='skeleton h-2 w-20 bg-white/[0.03] rounded-lg opacity-50'></div>
            </div>
        </div>
    );
};
export default ConversationSkeleton;
