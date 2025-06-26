import { create } from "zustand";
import { QuizType } from "@/types/types";

interface UseOwnerQuizsStoreProps {
  quizs: QuizType[];
  setQuizs: (data: QuizType | QuizType[] | null) => void;
  resetQuizs: () => void; // optional utility
}

export const useOwnerQuizsStore = create<UseOwnerQuizsStoreProps>((set, get) => ({
  quizs: [],

  setQuizs: (data) => {
    if (!data) return;

    const prev = get().quizs;

    // Handle both single and multiple
    const items = Array.isArray(data) ? data : [data];

    set({ quizs: [...prev, ...items] });
  },

  resetQuizs: () => set({ quizs: [] }),
}));
