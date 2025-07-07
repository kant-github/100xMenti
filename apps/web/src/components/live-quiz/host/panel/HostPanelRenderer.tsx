import { SessionStatus } from "@/types/types";
import { useLiveSessionStore } from "@/zustand/liveSession";
import LiveQuizQuestionActiveComponent from "../../LiveQuizComponents/LiveQuizQuestionActiveComponent";
import WaitingLobbyParticipant from "../../participant/waiting-lobby/WaitingLobbyParticipant";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";
import LiveSessionCodeTicker from "@/components/ticker/LiveSessionCodeTicker";


export default function HostPannelRenderer() {
    const { liveSession } = useLiveSessionStore();
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


    function renderComponent() {
        switch (liveSession.status) {
            case SessionStatus.WAITING:
                return <WaitingLobbyParticipant />
            case SessionStatus.QUESTION_ACTIVE:
                return <LiveQuizQuestionActiveComponent />
        }
    }

    return (
        <div className="w-full h-screen overflow-hidden">
            <LiveSessionCodeTicker sessionCode={liveSession.sessionCode} />
            {renderComponent()}
        </div>
    );
}