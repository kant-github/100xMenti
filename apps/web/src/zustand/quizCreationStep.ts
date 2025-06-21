import { create } from "zustand"

interface UseQuizCreationStepsStoreType {
  currentStep: number
  setCurrentStep: (step: number) => void
}

export const useQuizCreationStepsStore = create<UseQuizCreationStepsStoreType>((set) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
}))
