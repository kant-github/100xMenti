interface UtilitySideBarTwoProps {
    open: boolean;
    children: React.ReactNode;
    className?: string;
}

export default function UtilitySideBarTwo({
    open,
    children,
    className
}: UtilitySideBarTwoProps) {
    return (
        <div className={`transform transition-transform ease-in-out duration-300  whitespace-nowrap ${open ? '' : 'overflow-hidden'} flex flex-col justify-between bg-neutral-200 ${className}`}>
            {children}
        </div>
    );
}