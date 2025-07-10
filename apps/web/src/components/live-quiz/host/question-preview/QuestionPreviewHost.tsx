import { useLiveQuizDataStore } from "@/zustand/liveQuizStore";
import QuestionPreviewLeft from "./QuestionPreviewLeft";
import QuestionPreviewRight from "./QuestionPreviewRight";
import templates from "@/lib/templates";

export default function QuestionPreviewHost() {
    const { liveQuiz } = useLiveQuizDataStore()
    const selectedTemplate = templates.find(t => t.id === liveQuiz.template);

    return (
        <div className="min-h-screen z-0">
            <div className='grid grid-cols-[70%_30%]' style={{ backgroundColor: selectedTemplate.accent }}>
                <QuestionPreviewLeft selectedTemplate={selectedTemplate} />
                <QuestionPreviewRight selectedTemplate={selectedTemplate} />
            </div>
        </div>
    )
}