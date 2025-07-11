import { useLiveSessionStore } from "@/zustand/liveSession";
import WaitingLobbyParticipant from "../waiting-lobby/WaitingLobbyParticipant";
import { ParticipantScreen } from "@/types/types";
import { useLiveQuizDataStore } from "@/zustand/liveQuizStore";
import templates from "@/lib/templates";
import Countdown from "../question/Countdown";


export default function ParticipantPannelRenderer() {
    const { liveSession } = useLiveSessionStore();
    const { liveQuiz } = useLiveQuizDataStore()
    const selectedTemplate = templates.find(t => t.id === liveQuiz.template);

    // liveSession.participantScreen = ParticipantScreen.COUNTDOWN;

    function renderComponent() {
        switch (liveSession.participantScreen) {
            case ParticipantScreen.LOBBY:
                return <WaitingLobbyParticipant />
            case ParticipantScreen.COUNTDOWN:
                return <Countdown selectedTemplate={selectedTemplate} />

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