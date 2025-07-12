import { HostScreen } from "@/types/types";
import { useLiveSessionStore } from "@/zustand/liveSession";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";
import LiveSessionCodeTicker from "@/components/ticker/LiveSessionCodeTicker";
import { useHostEventSubscriptions } from "@/hooks/useHostEventSubscriptions";
import WaitingLobbyHost from "../waitng-lobby/WaitingLobbyHost";
import QuestionPreviewHost from "../question-preview/QuestionPreviewHost";
import templates from "@/lib/templates";
import { useLiveQuizDataStore } from "@/zustand/liveQuizStore";

export default function HostPannelRenderer() {
    const { liveSession } = useLiveSessionStore();
    const { liveQuiz } = useLiveQuizDataStore();
    const { sendJoinQuizMessage } = useWebSocket();
    const selectedTemplate = templates.find(t => t.id === liveQuiz.template);
    useHostEventSubscriptions();

    useEffect(() => {
        if (liveSession.id && liveSession.quizId) {
            const data = {
                quizId: liveSession.quizId,
                sessionId: liveSession.id
            }
            sendJoinQuizMessage(data);
        }
    }, [liveSession.id, liveSession.quizId])

    function renderComponent() {
        switch (liveSession.hostScreen) {
            case HostScreen.LOBBY:
                return <WaitingLobbyHost />
            case HostScreen.QUESTION_PREVIEW:
                return <QuestionPreviewHost />
        }
    }

    return (
        <div style={{
            backgroundColor: `${selectedTemplate.accent}`,
            color: `${selectedTemplate.textColor}`
        }} className="w-full h-screen overflow-hidden relative">
            <LiveSessionCodeTicker sessionCode={liveSession.sessionCode} />
            {renderComponent()}
        </div>
    );
}