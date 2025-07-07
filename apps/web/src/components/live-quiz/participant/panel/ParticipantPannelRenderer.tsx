import { SessionStatus } from "@/types/types";
import { useLiveSessionStore } from "@/zustand/liveSession";
import LiveQuizQuestionActiveComponent from "../../LiveQuizComponents/LiveQuizQuestionActiveComponent";
import WaitingLobbyParticipant from "../waiting-lobby/WaitingLobbyParticipant";


export default function ParticipantPannelRenderer() {
    const { liveSession } = useLiveSessionStore();

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
            {renderComponent()}
        </div>
    );
}