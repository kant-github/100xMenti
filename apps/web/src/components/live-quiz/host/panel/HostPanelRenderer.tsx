import { HostScreen, SessionStatus } from "@/types/types";
import { useLiveSessionStore } from "@/zustand/liveSession";
import LiveQuizQuestionActiveComponent from "../../common/LiveQuizQuestionActiveComponent";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";
import LiveSessionCodeTicker from "@/components/ticker/LiveSessionCodeTicker";
import { useHostEventSubscriptions } from "@/hooks/useHostEventSubscriptions";
import WaitingLobbyHost from "../waitng-lobby/WaitingLobbyHost";

export default function HostPannelRenderer() {
    const { liveSession } = useLiveSessionStore();
    const { sendJoinQuizMessage } = useWebSocket();
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
            case HostScreen.QUESTION_ACTIVE:
                return <LiveQuizQuestionActiveComponent />
            case HostScreen.QUESTION_PREVIEW:
                return <div>questions</div>
        }
    }

    return (
        <div className="w-full h-screen overflow-hidden relative">
            <LiveSessionCodeTicker sessionCode={liveSession.sessionCode} />

            
            {renderComponent()}
        </div>
    );
}