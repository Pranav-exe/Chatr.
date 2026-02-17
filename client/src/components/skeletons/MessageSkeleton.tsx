const MessageSkeleton = () => {
    return (
        <div className='flex flex-col gap-4 w-full animate-pulse'>
            {/* Left Skeleton */}
            <div className='flex gap-3 items-center'>
                <div className='skeleton w-9 h-9 rounded-full shrink-0 bg-white/[0.03]'></div>
                <div className='flex flex-col gap-1.5'>
                    <div className='skeleton h-8 w-48 bg-white/[0.03] rounded-2xl rounded-tl-none'></div>
                    <div className='skeleton h-2 w-12 bg-white/[0.03] rounded-lg ml-1'></div>
                </div>
            </div>

            {/* Right Skeleton */}
            <div className='flex gap-3 items-center justify-end'>
                <div className='flex flex-col items-end gap-1.5'>
                    <div className='skeleton h-8 w-36 bg-volt/[0.03] border border-volt/5 rounded-2xl rounded-tr-none'></div>
                    <div className='skeleton h-2 w-12 bg-white/[0.03] rounded-lg mr-1'></div>
                </div>
                <div className='skeleton w-9 h-9 rounded-full shrink-0 bg-white/[0.03]'></div>
            </div>
        </div>
    );
};
export default MessageSkeleton;
