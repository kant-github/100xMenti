import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface UtilitySideBarProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    content: React.ReactNode;
    width: string;
    bottomLogo?: boolean;
    blob?: boolean;
}

export default function UtilitySideBar({ open, setOpen, content, width, bottomLogo, blob }: UtilitySideBarProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup function - only remove when component unmounts or open changes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [open, setOpen]);
    
    return (
        <>
            <div 
                ref={ref} 
                className={`
                    fixed top-0 right-0 h-screen ${width} 
                    bg-neutral-200 border-l-[1px] border-zinc-300 dark:border-zinc-800 
                    dark:bg-neutral-900 dark:text-neutral-200 shadow-xl 
                    z-[60] rounded-xl transform transition-transform 
                    ease-in-out duration-300 overflow-hidden flex flex-col
                    ${open ? "translate-x-0" : "translate-x-full"}
                `}
                style={{
                    // Ensure the sidebar is always in the DOM for transitions
                    visibility: 'visible'
                }}
            >
                {blob && (
                    <div className="absolute right-0 pointer-events-none w-full h-full">
                        <div className="gooey-blob"></div>
                    </div>
                )}
                
                <div className={`flex-1 overflow-hidden ${bottomLogo ? 'pb-2' : ''}`}>
                    {content}
                </div>
            </div>
            
            <style jsx global>{`
                .gooey-blob {
                    height: 18rem;
                    width: 18rem;
                    position: absolute;
                    border-radius: 50%;
                    background: #eab308;
                    opacity: 0.2;
                    bottom: 30%;
                    right: 10%;
                    filter: blur(20px);
                    animation-name: gooey;
                    animation-duration: 6s;
                    animation-iteration-count: infinite;
                    animation-direction: alternate;
                    animation-timing-function: ease-in-out;
                }
                
                @keyframes gooey {
                    from {
                        filter: blur(20px);
                        transform: translate(10%, -10%) skew(0);
                    }
                    to {
                        filter: blur(30px);
                        transform: translate(-10%, 10%) skew(-12deg);
                    }
                }
            `}</style>
        </>
    );
}