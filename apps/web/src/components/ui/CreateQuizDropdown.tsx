import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { IoIosPlay } from "react-icons/io";
import { MdPublish } from "react-icons/md";
import UtilityCard from "./UtilityCard";
import { IoDocumentSharp } from "react-icons/io5";

interface CreateQuizDropdownProps {
    setDropdown: Dispatch<SetStateAction<boolean>>;
}

export default function CreateQuizDropdown({ setDropdown }: CreateQuizDropdownProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setDropdown]);

    return (
        <UtilityCard ref={ref} className="absolute right-0 top-full mt-2 w-[20rem] bg-neutral-100 border-[1px] border-neutral-300 rounded-md shadow-xl z-40 overflow-hidden">
            <div className="flex flex-col w-full gap-y-1">
                {/* Launch Quiz */}
                <div className="flex flex-row items-start w-full px-6 py-4 gap-4 bg-transparent hover:bg-neutral-200 text-left rounded-none border-none outline-none shadow-none focus:outline-none focus:ring-0">
                    <IoIosPlay className="text-neutral-900 w-6 h-6" />
                    <div className="flex flex-col items-start justify-center">
                        <span className="text-neutral-900 text-sm font-[3px]">Launch Quiz</span>
                    </div>
                </div>

                {/* Publish Quiz */}
                <div className="flex flex-row items-start w-full px-6 py-3 gap-4 bg-transparent hover:bg-neutral-200 text-left rounded-none border-none outline-none shadow-none focus:outline-none focus:ring-0">
                    <MdPublish className="text-neutral-900 w-8 h-8" />
                    <div className="flex flex-col items-start justify-center">
                        <span className="text-neutral-900 text-sm font-[3px]">Publish Quiz</span>
                        <span className="text-neutral-600 text-xs font-light">Make your quiz live and shareable with participants</span>
                    </div>
                </div>

                {/* Save Draft */}
                <div className="flex flex-row items-start w-full px-6 py-3 gap-4 bg-transparent hover:bg-neutral-200 text-left rounded-none border-none outline-none shadow-none focus:outline-none focus:ring-0">
                    <IoDocumentSharp className="text-neutral-900 w-6 h-6" />
                    <div className="flex flex-col items-start justify-center">
                        <span className="text-neutral-900 text-sm font-[3px]">Save Draft</span>
                        <span className="text-neutral-600 text-xs font-light">Store your progress — you can edit and publish it later</span>
                    </div>
                </div>
            </div>

        </UtilityCard>
    )
}