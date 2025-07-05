import { useLiveSessionStore } from "@/zustand/liveSession";
import { SessionStatus } from "@/types/types";
import LiveQuizWaitingComponent from "../LiveQuizComponents/LiveQuizWaitingComponent";
import LiveSessionCodeTicker from "@/components/ticker/LiveSessionCodeTicker";


export default function HostLivePanel() {
    const { liveSession } = useLiveSessionStore();

    function renderComponent() {
        switch (liveSession.status) {
            case SessionStatus.WAITING:
                return <LiveQuizWaitingComponent />
            case SessionStatus.QUESTION_ACTIVE:
        }
    }



    return (
        <div className="w-full h-screen overflow-hidden">
            <LiveSessionCodeTicker sessionCode={liveSession.sessionCode} />
        </div>
    );
}