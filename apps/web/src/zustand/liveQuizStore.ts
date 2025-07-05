import { QuizType } from "@/types/types";
import { create } from "zustand";

interface LiveQuizDataStoreProps {
    liveQuiz: QuizType | null
    setLiveQuiz: (data: QuizType) => void
}

export const useLiveQuizDataStore = create<LiveQuizDataStoreProps>((set) => ({
    liveQuiz: null,
    setLiveQuiz: (data: QuizType) => set({ liveQuiz: data })
}))