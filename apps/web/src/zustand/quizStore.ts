import { create } from "zustand"

export interface QuizQuestion {
    id: number
    question: string
    options: string[]
    correctAnswer: number
    timing: number
}

export interface QuizData {
    title: string
    template: string
    timing: number
    totalQuestions: number
    questions: QuizQuestion[]
}

interface QuizDataStore {
    quizData: QuizData
    setQuizData: (data: QuizData) => void
    updateQuizField: (field: keyof QuizData, value: any) => void
    updateQuestionField: (index: number, field: keyof QuizQuestion, value: any) => void
    updateOption: (questionIndex: number, optionIndex: number, value: string) => void
    addQuestion: () => void
}

export const useQuizDataStore = create<QuizDataStore>((set) => ({
    quizData: {
        title: 'Untitled Quiz',
        template: 'classic',
        timing: 30,
        totalQuestions: 1,
        questions: [
            {
                id: 1,
                question: '',
                options: ['', '', '', ''],
                correctAnswer: 0,
                timing: 30
            }
        ]
    },

    setQuizData: (data) => set({ quizData: data }),

    updateQuizField: (field, value) =>
        set((state) => ({
            quizData: { ...state.quizData, [field]: value }
        })),

    updateQuestionField: (index, field, value) =>
        set((state) => {
            const updatedQuestions = [...state.quizData.questions]
            updatedQuestions[index] = {
                ...updatedQuestions[index],
                [field]: value
            }
            return {
                quizData: {
                    ...state.quizData,
                    questions: updatedQuestions
                }
            }
        }),

    updateOption: (questionIndex, optionIndex, value) =>
        set((state) => {
            const updatedQuestions = [...state.quizData.questions]
            const updatedOptions = [...updatedQuestions[questionIndex].options]
            updatedOptions[optionIndex] = value
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                options: updatedOptions
            }
            return {
                quizData: {
                    ...state.quizData,
                    questions: updatedQuestions
                }
            }
        }),

    addQuestion: () =>
        set((state) => {
            const newQuestion: QuizQuestion = {
                id: state.quizData.questions.length + 1,
                question: 'Your question goes here...',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 0,
                timing: 30
            }
            const updatedQuestions = [...state.quizData.questions, newQuestion]
            return {
                quizData: {
                    ...state.quizData,
                    totalQuestions: updatedQuestions.length,
                    questions: updatedQuestions
                }
            }
        })
}))
