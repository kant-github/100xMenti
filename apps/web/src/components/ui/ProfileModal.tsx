import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react";
import { FileText, LogOut } from "lucide-react";
import UtilityCard from "./UtilityCard";
import { signOut } from "next-auth/react";

interface ProfileModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ProfileModal({ open, setOpen }: ProfileModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    }, [setOpen]);

    useEffect(() => {
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, handleClickOutside]);

    if (!open) return null;

    const menuItems = [
        {
            icon: FileText,
            label: "Drafted Quizzes",
            onClick: () => {
                // Handle drafted quizzes navigation
                console.log("Navigate to drafted quizzes");
                setOpen(false);
            }
        },
        {
            icon: LogOut,
            label: "Log Out",
            onClick: () => {
                signOut()
                console.log("User logged out");
                setOpen(false);
            },
            className: "text-red-600 hover:text-red-700 hover:bg-red-50"
        }
    ];

    return (
        <UtilityCard
            ref={modalRef}
            className="absolute right-full top-full z-50 w-48 rounded-l-xl rounded-br-xl border-[1px] border-neutral-300 bg-neutral-100 shadow-[20px] overflow-hidden"
        >
            <div className="py-1">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            type="button"
                            key={index}
                            onClick={item.onClick}
                            className={`
                                w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-left
                                transition-colors duration-150 ease-in-out
                                hover:bg-neutral-50 active:bg-neutral-100
                                focus:outline-none focus:bg-neutral-50
                                ${item.className || 'text-neutral-700 hover:text-neutral-900'}
                            `}
                        >
                            <Icon size={16} className="flex-shrink-0" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </UtilityCard>
    );
}