import { useEffect, useRef, useState } from "react";
import { FileText, LogOut } from "lucide-react";
import UtilityCard from "./UtilityCard";
import DraftedQuizSidebar from "./DraftedQuizSidebar";
import LogOutModal from "./LogOutModal";
import Image from "next/image";
import { useSessionStore } from "@/zustand/sessionZustand";
import { handleClickOutside } from "@/lib/handleClickOutisde";

export default function ProfileModal() {
    const [openHostsQuizsSidebar, setOpenHostsQuizsSidebar] = useState<boolean>(false);
    const [openLogoutDropDown, setOpenLogoutDropDown] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const [openProfileModal, setOpenProfileModal] = useState<boolean>(false)
    const { session } = useSessionStore();

    function openHandleQuizDropdownHandler() {
        setOpenHostsQuizsSidebar(true)
        setOpenProfileModal(false)
    }

    function openLogOutDropdownHandler() {
        setOpenLogoutDropDown(true);
        setOpenProfileModal(false);
    }

    useEffect(() => {
        function clickHandler(event: MouseEvent) {
            handleClickOutside(event, ref, setOpenProfileModal);
        }

        if (openProfileModal) {
            document.addEventListener("mousedown", clickHandler);
            return () => {
                document.removeEventListener("mousedown", clickHandler);
            };
        }
    }, [openProfileModal]);

    return (
        <div ref={ref}>
            <div>
                {session?.user && (
                    <Image
                        onClick={() => setOpenProfileModal(prev => !prev)}
                        className="rounded-full select-none cursor-pointer transform transition-transform duration-300 hover:scale-105"
                        src={session.user.image!}
                        width={32}
                        height={32}
                        alt="user"
                    />
                )}
            </div>
            {
                openProfileModal && (
                    <UtilityCard
                        className="absolute border-[1px] dark:border-neutral-700 border-neutral-300 cursor-pointer right-8 mt-2 w-48 font-light dark:bg-neutral-900 bg-white rounded-xl shadow-lg select-none z-50 overflow-hidden"
                    >
                        <div className="py-1">
                            <button
                                type="button"
                                onClick={openHandleQuizDropdownHandler}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-neutral-700 text-left hover:bg-neutral-50 hover:text-neutral-900 transition"
                            >
                                <FileText size={16} className="flex-shrink-0" />
                                <span className="font-medium">Drafted Quizzes</span>
                            </button>

                            <button
                                type="button"
                                onClick={openLogOutDropdownHandler}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 text-left hover:text-red-700 hover:bg-red-50 transition"
                            >
                                <LogOut size={16} className="flex-shrink-0" />
                                <span className="font-medium">Log Out</span>
                            </button>
                        </div>
                    </UtilityCard>
                )
            }

            {
                openLogoutDropDown && (
                    <LogOutModal
                        logoutDropdown={openLogoutDropDown}
                        setLogoutDropDown={setOpenLogoutDropDown}
                    />
                )
            }

            <DraftedQuizSidebar
                open={openHostsQuizsSidebar}
                setOpen={setOpenHostsQuizsSidebar}
            />
        </div >
    );
}
