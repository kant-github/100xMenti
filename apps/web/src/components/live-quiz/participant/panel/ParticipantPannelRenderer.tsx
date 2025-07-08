import { CurrentScreen } from "@/types/types";
import { useLiveSessionStore } from "@/zustand/liveSession";
import LiveQuizQuestionActiveComponent from "../../common/LiveQuizQuestionActiveComponent";
import WaitingLobbyParticipant from "../waiting-lobby/WaitingLobbyParticipant";


export default function ParticipantPannelRenderer() {
    const { liveSession } = useLiveSessionStore();

    function renderComponent() {
        switch (liveSession.currentScreen) {
            case CurrentScreen.LOBBY:
                return <WaitingLobbyParticipant />
            case CurrentScreen.QUESTION_ACTIVE:
                return <LiveQuizQuestionActiveComponent />
        }
    }

    return (
        <div className="w-full h-screen overflow-hidden">
            {renderComponent()}
        </div>
    );
}