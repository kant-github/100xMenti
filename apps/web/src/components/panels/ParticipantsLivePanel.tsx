import { SessionStatus } from "@/types/types";
import { useLiveSessionStore } from "@/zustand/liveSession";
import LiveQuizWaitingComponent from "../live-quiz/LiveQuizComponents/LiveQuizWaitingComponent";
import LiveQuizQuestionActiveComponent from "../live-quiz/LiveQuizComponents/LiveQuizQuestionActiveComponent";

export default function ParticipantsLivePanel() {
    const { liveSession } = useLiveSessionStore();

    function renderComponent() {
        switch (liveSession.status) {
            case SessionStatus.WAITING:
                return <LiveQuizWaitingComponent />
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