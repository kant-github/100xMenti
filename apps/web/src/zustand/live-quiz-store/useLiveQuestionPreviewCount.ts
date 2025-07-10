import { create } from "zustand";

interface LiveQuestionPreviewCountProps {
    currentQuestionIx: number,
    setCurrentQuestionIx: (data: number) => void
}

export const useLiveQuestionPreviewCount = create<LiveQuestionPreviewCountProps>((set, get) => ({
    currentQuestionIx: 0,
    setCurrentQuestionIx: (data: number) => set({ currentQuestionIx: data })
}))