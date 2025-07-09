import { useLiveSessionStore } from "@/zustand/liveSession";
import LiveQuizQuestionActiveComponent from "../../common/LiveQuizQuestionActiveComponent";
import WaitingLobbyParticipant from "../waiting-lobby/WaitingLobbyParticipant";
import { ParticipantScreen } from "@/types/types";


export default function ParticipantPannelRenderer() {
    const { liveSession } = useLiveSessionStore();

    function renderComponent() {
        switch (liveSession.participantScreen) {
            case ParticipantScreen.LOBBY:
                return <WaitingLobbyParticipant />
            case ParticipantScreen.QUESTION_ACTIVE:
                return <LiveQuizQuestionActiveComponent />
        }
    }

    return (
        <div className="w-full h-screen overflow-hidden">
            {renderComponent()}
        </div>
    );
}