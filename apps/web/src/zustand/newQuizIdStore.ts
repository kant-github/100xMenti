import { create } from "zustand";

interface NewQuizIdStore {
  newQuizId: string | null;
  setNewQuizId: (data: string) => void;
}

export const useNewQuizIdStore = create<NewQuizIdStore>((set) => ({
  newQuizId: null,
  setNewQuizId: (data) => set({ newQuizId: data }),
}));
