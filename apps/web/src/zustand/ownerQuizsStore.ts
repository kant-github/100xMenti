import { create } from "zustand";
import { QuizType } from "@/types/types";

interface UseOwnerQuizsStoreProps {
  quizs: QuizType[];
  setQuizs: (data: QuizType | QuizType[] | null) => void;
  removeQuiz: (data: string) => void;
  resetQuizs: () => void; // optional utility
}

export const useOwnerQuizsStore = create<UseOwnerQuizsStoreProps>((set, get) => ({
  quizs: [],

  setQuizs: (data) => {
    if (!data) return;

    const prev = get().quizs;
    const items = Array.isArray(data) ? data : [data];

    const updated = [...prev];

    items.forEach((newQuiz) => {
      const index = updated.findIndex((q) => q.id === newQuiz.id);
      if (index !== -1) {
        updated[index] = newQuiz;
      } else {
        updated.push(newQuiz);
      }
    });

    set({ quizs: updated });
  },
  removeQuiz: (quizId: string) => {
    const filtered = get().quizs.filter((quiz) => quiz.id !== quizId);
    set({ quizs: filtered })
  },

  resetQuizs: () => set({ quizs: [] }),
}));
