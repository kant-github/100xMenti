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
    const { participant, setParticipant } = useliveQuizMeParticipantStore();
    const [token, setToken] = useState<string>('');
    const { setLiveQuiz } = useLiveQuizDataStore();
    const { setLiveSession } = useLiveSessionStore();
    const { setParticipants } = useLiveQuizParticipantsStore()
    useWebSocket();
    useSubscribeToHandlers();
    useEffect(() => {
        const participant = JSON.parse(localStorage.getItem('participant'));
        setParticipant(participant);
        const participantToken = sessionStorage.getItem('quiz_token');
        const hostToken = sessionStorage.getItem('host_token');
        setToken(hostToken || participantToken);
    }, [])

    async function onPageHandler() {
        let url = `${LIVE_QUIZ_URL}/${quizId}`;
        const params = new URLSearchParams();

        if (participant?.id) {
            params.append('participantId', participant.id);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        try {
            const { data } = await axios.get(`${url}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("data fetched from backend is : ", data);
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
        <div>
            {type === UserType.UNKNOWN && <div>loading</div>}
            {type === UserType.HOST && <HostPannelRenderer />}
            {type === UserType.USER && <ParticipantPannelRenderer />}
        </div>
    )
}