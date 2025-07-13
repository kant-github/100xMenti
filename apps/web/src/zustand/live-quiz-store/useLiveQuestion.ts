import { LiveQuestionType } from "@/types/types";
import { create } from "zustand";

interface LiveQuestionProps {
    question: LiveQuestionType | null;
    setQuestion: (data: LiveQuestionType) => void;
    updateQuestion: (data: Partial<LiveQuestionType>) => void;
}

export const useLiveQuestion = create<LiveQuestionProps>((set, get) => ({
    question: null,
    setQuestion: (data: LiveQuestionType) => set({ question: data }),
    updateQuestion: (data: Partial<LiveQuestionType>) => {
        const currentQuestionData = get().question;
        if (!currentQuestionData) return;

        set({
            question: {
                ...currentQuestionData,
                ...data
            }
        })
    }
}))