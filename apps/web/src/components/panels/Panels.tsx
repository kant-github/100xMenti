import { useState } from "react";
import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";
import { useQuizDataStore } from "@/zustand/quizStore";

export const templates = [
    { id: 'classic', name: 'Classic Blue', bg: 'bg-blue-600', accent: 'bg-blue-500' },
    { id: 'modern', name: 'Modern Purple', bg: 'bg-purple-600', accent: 'bg-purple-500' },
    { id: 'vibrant', name: 'Vibrant Orange', bg: 'bg-orange-500', accent: 'bg-orange-400' },
    { id: 'minimal', name: 'Minimal Gray', bg: 'bg-gray-700', accent: 'bg-gray-600' }
];

export default function Panels() {
    const [sideBar, setSideBar] = useState<boolean>(true);
    const { quizData } = useQuizDataStore()
    const selectedTemplate = templates.find(t => t.id === quizData.template);
    return (
        <div className={`flex h-screen w-full overflow-hidden ${selectedTemplate.bg}`}>
            <LeftPanel />
            <RightPanel openRightPanel={sideBar} setOpenRightPanel={setSideBar} />
        </div>
    );
}
