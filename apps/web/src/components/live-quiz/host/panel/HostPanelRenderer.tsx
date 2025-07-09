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
        }
    }

    return (
        <div className="w-full h-screen overflow-hidden relative">
            <LiveSessionCodeTicker sessionCode={liveSession.sessionCode} />
            {liveSession.status === SessionStatus.LIVE && (
                <div className="absolute top-1 left-1 flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full border border-green-500">
                    <div className="h-2.5 w-2.5 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-700 font-medium">Live</span>
                </div>
            )}
            {renderComponent()}
        </div>
    );
}