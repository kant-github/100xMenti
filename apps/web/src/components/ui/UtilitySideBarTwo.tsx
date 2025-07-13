interface UtilitySideBarTwoProps {
    children: React.ReactNode;
    className?: string;
}

export default function UtilitySideBarTwo({
    children,
    className
}: UtilitySideBarTwoProps) {
    return (
        <div className='h-screen border-l-[1px] border-neutral-300 shadow-xl z-[60] rounded-l-xl transform transition-transform ease-in-out duration-300 overflow-hidden flex flex-col justify-between bg-neutral-200'>
            {children}
        </div>
    );
}