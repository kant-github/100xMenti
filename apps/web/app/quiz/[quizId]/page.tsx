'use client'
import DashNav from "@/components/navbar/DashNav";
import Panels from "@/components/panels/Panels";
import UtilityCard from "@/components/ui/UtilityCard";
import { GET_QUIZ_URL } from "@/lib/api_routes";
import { useNewQuizIdStore } from "@/zustand/newQuizIdStore";
import { useQuizDataStore } from "@/zustand/quizStore";
import { useSessionStore } from "@/zustand/sessionZustand";
import axios from "axios";
import { use, useEffect } from "react";

interface PageProps {
    params: Promise<{
        quizId: string;
    }>;
}

export default function Home({ params }: PageProps) {
    const { quizId } = use(params)
    const { setNewQuizId } = useNewQuizIdStore();
    const { session } = useSessionStore();
    const { setQuizData } = useQuizDataStore()
    
    useEffect(() => {
        if (quizId) {
            setNewQuizId(quizId);
        }
    }, [setNewQuizId, quizId]);
    
    useEffect(() => {
        if (quizId && session?.user?.token) {
            getQuiz();
        }
    }, [session, quizId]);
    
    async function getQuiz() {
        try {
            console.log(`${GET_QUIZ_URL}`);
            const { data } = await axios.get(`${GET_QUIZ_URL}/${quizId}`, {
                headers: {
                    Authorization: `Bearer ${session?.user?.token}`
                }
            });
            const {
                title,
                template,
                defaultTimeLimit,
                createdAt,
                updatedAt,
                isUpdated,
                questions
            } = data.data;
            setQuizData({
                title: title,
                template: template,
                timing: defaultTimeLimit,
                totalQuestions: questions.length,
                createdAt,
                updatedAt,
                isUpdated,
                questions: questions.map(q => ({
                    id: q.id,
                    question: q.title,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    timing: q.timing
                }))
            })
        } catch (error) {
            console.error("Backend call failed:", error);
            console.error("Error response:", error.response?.data);
        }
    }
    
    return (
        <div className="w-full h-screen flex flex-col">
            <DashNav />
            <UtilityCard className="bg-neutral-200 w-full flex-1 overflow-hidden">
                <Panels />
            </UtilityCard>
        </div>
    );
}