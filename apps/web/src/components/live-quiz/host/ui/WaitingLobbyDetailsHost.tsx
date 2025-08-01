import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useLiveQuizParticipantsStore } from "@/zustand/liveQuizParticipants";
import { useLiveQuizDataStore } from "@/zustand/liveQuizStore";
import { useLiveSessionStore } from "@/zustand/liveSession";
import { Info } from "lucide-react";
import Image from "next/image";
import InfoCard from "../../common/InfoCard";

export default function WaitingLobbyDetailsHost() {
    const { participants } = useLiveQuizParticipantsStore();
    const { liveQuiz } = useLiveQuizDataStore()
    const { liveSession } = useLiveSessionStore();

    const { sendStartQuizMessage } = useWebSocket()
    function handleStartQuiz() {
        const payload = {
            sessionId: liveSession.id
        }
        sendStartQuizMessage(payload);
    };

    const canStart = participants.length >= 2;

    return (
        <div className="h-full flex flex-col justify-between">
            <div className="space-y-6 flex-shrink-0">

                <InfoCard />

                {/* Host Info Section */}
                <div className="flex items-center justify-between gap-x-3 bg-neutral-100 px-4 py-2 rounded-xl shadow-sm">
                    <div className='flex items-center gap-x-3'>
                        <Image
                            src={liveQuiz.creator.image || "/placeholder-avatar.png"}
                            width={32}
                            height={32}
                            alt={`${liveQuiz.creator.name || "Quiz Creator"}'s avatar`}
                            className="rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-neutral-900">
                                {liveQuiz.creator.name || "Unknown"}
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                {liveQuiz.creator.email}
                            </span>
                        </div>
                    </div>
                    <span className='text-sm font-medium text-neutral-500 select-none'>host</span>
                </div>
            </div>
            <div className="flex flex-col gap-y-5">
                <div className='p-4 bg-neutral-300 rounded-xl border border-neutral-300'>
                    <div className='flex items-start gap-x-3'>
                        <Info size={16} className='text-neutral-600 mt-0.5' />
                        <div>
                            <h4 className='text-sm font-medium text-neutral-900 mb-1'>Before you start</h4>
                            <ul className='text-xs text-neutral-700 space-y-1'>
                                <li>• Ensure you have a stable internet connection</li>
                                <li>• Keep this tab active to monitor participants</li>
                                <li>• You can control the quiz flow and timing</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="space-y-3 flex-shrink-0">
                    <Button
                        onClick={handleStartQuiz}
                        disabled={!canStart}
                        className="w-full h-12 bg-neutral-800 hover:bg-neutral-700 text-white font-medium disabled:bg-neutral-300 disabled:text-neutral-500 transition-colors rounded-xl"
                    >
                        {canStart ? 'Start Quiz' : 'Waiting...'}
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full h-10 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 text-sm font-normal rounded-xl"
                    >
                        Cancel Session
                    </Button>
                </div>
            </div>
        </div>
    )
}