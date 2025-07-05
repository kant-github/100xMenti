import templates from "@/lib/templates";
import { useLiveQuizDataStore } from "@/zustand/liveQuizStore";

export default function HostLiveLeftPanel() {
    const { liveQuiz } = useLiveQuizDataStore();
    const selectedTemplate = templates.find(t => t.id === liveQuiz.template);
    return (
        <div className="h-full">
            <div className="h-full" style={{ backgroundColor: selectedTemplate?.bg }}>
                hey
            </div>
        </div>
    )
}