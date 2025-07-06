'use client'
import { useLiveSessionStore } from "@/zustand/liveSession";
import LiveSessionCodeTicker from "@/components/ticker/LiveSessionCodeTicker";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";


export default function HostLivePanel() {
    const { liveSession } = useLiveSessionStore();

    const { sendJoinQuizMessage } = useWebSocket();

    useEffect(() => {
        if (liveSession.id && liveSession.quizId) {
            const data = {
                quizId: liveSession.quizId,
                sessionId: liveSession.id
            }
            console.log("data sending to join the quiz is : ", data);
            sendJoinQuizMessage(data);
        }
    }, [liveSession.id, liveSession.quizId])

    return (
        <div className="w-full h-screen overflow-hidden">
            <LiveSessionCodeTicker sessionCode={liveSession.sessionCode} />
        </div>
    );
}