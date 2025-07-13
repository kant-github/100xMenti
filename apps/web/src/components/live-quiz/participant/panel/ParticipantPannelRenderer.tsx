import { useLiveSessionStore } from "@/zustand/liveSession";
import WaitingLobbyParticipant from "../waiting-lobby/WaitingLobbyParticipant";
import { ParticipantScreen } from "@/types/types";
import { useLiveQuizDataStore } from "@/zustand/liveQuizStore";
import templates from "@/lib/templates";
import QuestionMotivation from "../question/QuestionMotivation";
import QuestionReading from "../question/QuestionReading";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";
import { useParticipantsEventSubscriptions } from "@/hooks/useParticipantsEventSubscriptions";
import QuestionActive from "../question/QuestionActive";


export default function ParticipantPannelRenderer() {
    const { liveSession } = useLiveSessionStore();
    const { liveQuiz } = useLiveQuizDataStore()
    const selectedTemplate = templates.find(t => t.id === liveQuiz.template);
    useParticipantsEventSubscriptions()
    // liveSession.participantScreen = ParticipantScreen.QUESTION_ACTIVE;

    const { sendJoinQuizMessage } = useWebSocket();
    useEffect(() => {
        if (liveSession.id && liveSession.quizId) {
            const data = {
                quizId: liveSession.quizId,
                sessionId: liveSession.id
            }
            sendJoinQuizMessage(data);
        }
    }, [liveSession.id, liveSession.quizId])
    console.log("screen is : ", liveSession.participantScreen);
    function renderComponent() {
        switch (liveSession.participantScreen) {
            case ParticipantScreen.LOBBY:
                return <WaitingLobbyParticipant template={selectedTemplate} />
            case ParticipantScreen.MOTIVATION:
                return <QuestionMotivation template={selectedTemplate} />;
            case ParticipantScreen.COUNTDOWN:
                return <QuestionReading template={selectedTemplate} />;
            case ParticipantScreen.QUESTION_ACTIVE:
                return <QuestionActive template={selectedTemplate} />;
            default:
                return null;

        }
    }

    return (
        <div style={{
            backgroundColor: `${selectedTemplate.accent}`,
            color: `${selectedTemplate.textColor}`
        }} className="w-full h-screen overflow-hidden">
            {renderComponent()}
        </div>
    );
}