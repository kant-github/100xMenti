import { useState } from "react";
import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";
import { useQuizDataStore } from "@/zustand/quizStore";

export const templates = [
    { id: 'classic', name: 'Classic Blue', bg: '#2563EB', accent: '#9bc1ff' },
    { id: 'modern', name: 'Modern Purple', bg: '#7C3AED', accent: '#d1beff' }, // bg-purple-600, purple-500
    { id: 'vibrant', name: 'Vibrant Orange', bg: '#F97316', accent: '#fcd5b4' }, // orange-500, orange-400
    { id: 'minimal', name: 'Minimal Gray', bg: '#30353c', accent: '#484c53' }  // gray-700, gray-600
];


export default function Panels() {
    const [sideBar, setSideBar] = useState<boolean>(true);
    const { quizData } = useQuizDataStore()
    const selectedTemplate = templates.find(t => t.id === quizData.template);
    return (
        <div
            className="flex h-screen w-full overflow-hidden bg-neutral-200"
        >
            <LeftPanel />
            <RightPanel />
        </div>
    );
}
