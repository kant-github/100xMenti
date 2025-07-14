import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";
import { useQuizDataStore } from "@/zustand/quizStore";
import templates from "@/lib/templates";

export default function Panels() {
    const { quizData } = useQuizDataStore();
    const selectedTemplate = templates.find(t => t.id === quizData.template);
    
    return (
        <div className="flex flex-row h-full w-full">
            <LeftPanel />
            <RightPanel template={selectedTemplate} />
        </div>
    );
}