 ..import { useEffect, useState } from "react";
import AppLogo from "../ui/AppLogo";
import { Button } from "../ui/button";
import ProfileModal from "../ui/ProfileModal";
import { FaCaretDown } from "react-icons/fa";
import CreateQuizDropdown from "../ui/CreateQuizDropdown";



interface CreateQuizNavBarProps {
    quizId: string
}

const SECONDS = 1000;

export default function CreateQuizNavBar({ quizId }: CreateQuizNavBarProps) {
    const [dropdown, setDropdown] = useState<boolean>(false);
    useEffect(() => {
        const interval = setInterval(() => {
            //backend call to update the quiz automatically
            console.log("backend call made");

        }, 3 * SECONDS)
        return () => {
            clearInterval(interval);
        }
    }, [quizId])

    return (
        <div className="w-full h-20 bg-neutral-100 flex items-center justify-between px-12">
            <AppLogo />
            <div className="flex items-center justify-center gap-4 ">
                <div className="flex items-center justify-center gap-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600 block animate-pulse" />
                    <span className="text-xs text-neutral-600 underline text-wrap">updates automatically</span>
                </div>
                <div className="relative">
                    <Button onMouseOver={() => setDropdown(true)} className="bg-neutral-900 hover:bg-neutral-900 text-neutral-200 font-light text-sm rounded-full flex flex-row items-center py-0 px-1 overflow-hidden gap-0">
                        <div className="border-r-[1px] border-neutral-300 px-4 py-2 flex items-center">
                            Launch
                        </div>
                        <div className="px-3 py-2 flex items-center">
                            <FaCaretDown className="w-4 h-4" />
                        </div>
                    </Button>
                    {dropdown && (
                        <CreateQuizDropdown setDropdown={setDropdown} />
                    )}
                </div>

                <ProfileModal />
            </div>
        </div>
    );
}