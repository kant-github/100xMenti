import { CurrentScreen } from "@/types/types";
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
        switch (liveSession.currentScreen) {
            case CurrentScreen.LOBBY:
                return <WaitingLobbyHost />
            case CurrentScreen.QUESTION_ACTIVE:
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