import { LiveQuestionType } from "@/types/types";
import { create } from "zustand";

interface LiveQuestionProps {
    question: LiveQuestionType | null;
    setQuestion: (data: LiveQuestionType) => void;
}

export const useLiveQuestion = create<LiveQuestionProps>((set, get) => ({
    question: null,
    setQuestion: (data: LiveQuestionType) => set({ question: data }),
}))