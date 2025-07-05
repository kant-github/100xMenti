'use client'
import HostLivePanel from "@/components/live-quiz/host/HostLivePanel";
import ParticipantsLivePanel from "@/components/panels/ParticipantsLivePanel";
import { LIVE_QUIZ_URL } from "@/lib/api_routes";
import { useliveQuizMeParticipantStore } from "@/zustand/liveQuizMeParticipant";
import { useLiveQuizDataStore } from "@/zustand/liveQuizStore";
import { useLiveSessionStore } from "@/zustand/liveSession";
import { useSessionStore } from "@/zustand/sessionZustand";
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
    const { session } = useSessionStore();
    const { setLiveQuiz } = useLiveQuizDataStore()
    const { setLiveSession } = useLiveSessionStore();
    const { participant } = useliveQuizMeParticipantStore()
    console.log("participant is : ", participant);

    async function onPageHandler() {
        console.log("call made ");
        if (!session?.user?.token) return;
        console.log("call made 2");

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
                    Authorization: `Bearer ${session.user.token}`
                }
            });
            console.log("data user type is : ", data.userType);

            if (data.userType === 'HOST') {
                setType(UserType.HOST);
                setLiveQuiz(data.quiz);
                setLiveSession(data.liveSession);
            } else if (data.userType === 'PARTICIPANT') {
                setType(UserType.USER)
                setLiveQuiz(data.quiz);
                setLiveSession(data.liveSession);
            }
        } catch (err) {
            console.error("Error in on page handler", err);
        }
    }

    useEffect(() => {
        onPageHandler();
    }, [session?.user?.token])

    return (
        <div>
            {type === UserType.UNKNOWN && <div>loading</div>}
            {type === UserType.HOST && <HostLivePanel />}
            {type === UserType.USER && <ParticipantsLivePanel />}
        </div>
    )
}