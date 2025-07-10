import { useLiveQuizParticipantsStore } from "@/zustand/liveQuizParticipants";
import { useLiveQuizDataStore } from "@/zustand/liveQuizStore";

export default function InfoCard() {
    const { participants } = useLiveQuizParticipantsStore();
    const { liveQuiz } = useLiveQuizDataStore();
    const canStart = participants.length >= 2;
    return (
        <div className="space-y-4 p-4 bg-neutral-800 rounded-xl border border-neutral-800">
            <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Participants</span>
                <span className="text-xs font-bold text-neutral-400 tabular-nums">{participants.length}</span>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Questions</span>
                <span className="text-xs font-bold text-neutral-400 tabular-nums">{liveQuiz.questions.length}</span>
            </div>

            <div className="space-y-2">
                <hr className="border-neutral-700/50" />
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <div className={`w-2 h-2 rounded-full ${canStart ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span>
                        {canStart ? "Ready to start" : `${2 - participants.length} more needed`}
                    </span>
                </div>
            </div>
        </div>
    )
}