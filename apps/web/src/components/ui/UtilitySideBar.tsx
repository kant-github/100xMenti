import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface UtilitySideBarProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
}

export default function UtilitySideBar({ open, setOpen, children }: UtilitySideBarProps) {

    const ref = useRef<HTMLDivElement>(null);

    function handleClickOutSide(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setOpen(false);
        }
    }

    useEffect(() => {
        if (open) {
            document.addEventListener('mousedown', handleClickOutSide);
        } else {
            document.removeEventListener('mousedown', handleClickOutSide);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutSide);
        }
    }, [open, setOpen])

    return (
        <div ref={ref} className={`fixed top-0 right-0 h-screen w-[500px] overflow-hidden border-l-[1px] dark:border-zinc-800 border-neutral-300 dark:bg-neutral-900 dark:text-neutral-200 shadow-xl z-50 rounded-l-md bg-neutral-200 transform transition-transform ease-in-out duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} `}>
            {children}
        </div>
    )
}