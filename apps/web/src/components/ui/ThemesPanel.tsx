import { Dispatch, SetStateAction } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Renderer } from "../panels/RightPanel";
import Image from "next/image";
import { Button } from "./button";
import { useQuizDataStore } from "@/zustand/useQuizDataStore";
import templates from "@/lib/templates";

interface ThemesPanelProps {
    setShowPanel: Dispatch<SetStateAction<Renderer | null>>;
}

export default function ThemesPanel({ setShowPanel }: ThemesPanelProps) {
    const { updateQuizField, quizData } = useQuizDataStore();
    
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between w-full p-2 flex-shrink-0">
                <span className="text-sm font-medium">Themes</span>
                <IoCloseOutline size={22} onClick={() => setShowPanel(null)} className="cursor-pointer" />
            </div>
            <hr className="border-[0.5px] border-neutral-300" />
            <div className="text-xs mt-4 px-2">Default templates</div>
            <div className="mt-4 px-2 pb-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    {templates.map((template, idx) => (
                        <div
                            onClick={() => updateQuizField('template', template.id)}
                            key={idx}
                            className={`flex flex-col items-center gap-y-1 p-0 w-full h-auto rounded-[9px`}
                        >
                            <div className={`w-full relative overflow-hidden rounded-[8px] flex items-center justify-center ${quizData.template === template.id && "border border-purple-800 bg-neutral-200"}`}>
                                <Image
                                    src={`/templates/${template.src}.png`}
                                    alt="template"
                                    width={160}
                                    height={120}
                                    className="rounded-md max-w-full max-h-full object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="text-center text-xs w-full ">{template.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}