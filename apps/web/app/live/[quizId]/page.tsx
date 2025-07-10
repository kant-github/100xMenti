'use client'
import HostPannelRenderer from "@/components/live-quiz/host/panel/HostPanelRenderer";
import ParticipantPannelRenderer from "@/components/live-quiz/participant/panel/ParticipantPannelRenderer";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useSubscribeToHandlers } from "@/hooks/useSubscribeToHandlers";
import { LIVE_QUIZ_URL } from "@/lib/api_routes";
import { useliveQuizMeParticipantStore } from "@/zustand/liveQuizMeParticipant";
import { useLiveQuizParticipantsStore } from "@/zustand/liveQuizParticipants";
import { useLiveQuizDataStore } from "@/zustand/liveQuizStore";
import { useLiveSessionStore } from "@/zustand/liveSession";
import axios from "axios";
import { use, useEffect, useState } from "react"
import AppLogo from "@/components/ui/AppLogo";
import WaitingLobbyBottomTicker from "@/components/live-quiz/participant/waiting-lobby/WaitingLobbyBottomTicker";

interface PageProps {
    params: Promise<{
        quizId: string;
    }>;
}

enum UserType {
    USER,
    HOST,
    UNKNOWN
}

export default function Home({ params }: PageProps) {
    const { quizId } = use(params);
    const [type, setType] = useState<UserType>(UserType.UNKNOWN);
    const { setParticipant } = useliveQuizMeParticipantStore();
    const [token, setToken] = useState<string>('');
    const { setLiveQuiz } = useLiveQuizDataStore();
    const { setLiveSession } = useLiveSessionStore();
    const { participants, setParticipants } = useLiveQuizParticipantsStore()
    useWebSocket();
    useSubscribeToHandlers();
    useEffect(() => {
        const participantToken = sessionStorage.getItem('quiz_token');
        const hostToken = sessionStorage.getItem('host_token');
        setToken(hostToken || participantToken);
    }, [])

    async function onPageHandler() {
        try {
            const { data } = await axios.get(`${LIVE_QUIZ_URL}/${quizId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data.userType === 'HOST') {
                setType(UserType.HOST);
                setLiveQuiz(data.quiz);
                setLiveSession(data.liveSession);
                setParticipants(data.liveSession.participants);
            } else if (data.userType === 'PARTICIPANT') {
                setType(UserType.USER)
                setLiveQuiz(data.quiz);
                setLiveSession(data.liveSession);
                setParticipants(data.liveSession.participants);
                setParticipant(data.participant);
            }
        } catch (err) {
            console.error("Error in on page handler", err);
        }
    }

    useEffect(() => {
        if (token) {
            onPageHandler();
        }
    }, [token])

    return (
        <div className="relative">
            {/* <AppLogo className="absolute left-3 top-2 z-1" /> */}
            {type === UserType.UNKNOWN && <div>loading</div>}
            {type === UserType.HOST && <HostPannelRenderer />}
            {type === UserType.USER && <ParticipantPannelRenderer />}
            <WaitingLobbyBottomTicker participants={participants} />
        </div>
    )
}