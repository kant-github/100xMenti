import { useLiveQuizDataStore } from "@/zustand/liveQuizStore";
import QuestionPreviewLeft from "./QuestionPreviewLeft";
import QuestionPreviewRight from "./QuestionPreviewRight";
import templates from "@/lib/templates";
import { useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useLiveSessionStore } from "@/zustand/liveSession";
import { useLiveQuestionPreviewCount } from "@/zustand/live-quiz-store/useLiveQuestionPreviewCount";

export default function QuestionPreviewHost() {
    const { liveQuiz } = useLiveQuizDataStore()
    const { liveSession } = useLiveSessionStore();
    const selectedTemplate = templates.find(t => t.id === liveQuiz.template);
    const { sendLaunchQuestion } = useWebSocket();

    const { currentQuestionIx } = useLiveQuestionPreviewCount();
    const currentQ = liveQuiz.questions[currentQuestionIx];


    function catchEnterClick(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            console.log("Enter key pressed by host!");
            launchQuestion();
        }
    }

    function launchQuestion() {
        const payload = {
            sessionId: liveSession.id,
            questionId: currentQ.id
        }
        sendLaunchQuestion(payload)
    }

    useEffect(() => {
        document.addEventListener('keydown', catchEnterClick)
        return () => {
            document.removeEventListener('keydown', catchEnterClick);
        };
    }, [])

    return (
        <div className="min-h-screen z-0">
            <div className='grid grid-cols-[70%_30%]' style={{ backgroundColor: selectedTemplate.accent }}>
                <QuestionPreviewLeft currentQuestionIx={currentQuestionIx} liveQuiz={liveQuiz} selectedTemplate={selectedTemplate} />
                <QuestionPreviewRight selectedTemplate={selectedTemplate} />
            </div>
        </div>
    )
}