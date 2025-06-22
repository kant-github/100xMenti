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
    createdAt: Date
    updatedAt: Date
    isUpdated: boolean
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
        title: 'Advanced JavaScript & React Challenge',
        template: 'MODERN',
        timing: 45,
        totalQuestions: 1,
        createdAt: null,
        updatedAt: null,
        isUpdated: false,
        questions: [
            {
                id: 1,
                question: 'What will be the output of this JavaScript code?\n\nconsole.log(typeof typeof 1);',
                options: ['number', 'string', 'undefined', 'object'],
                correctAnswer: 1,
                timing: 45
            },
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
                question: 'What is the time complexity of searching in a balanced binary search tree?',
                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                correctAnswer: 1,
                timing: 40
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

interface CurrentQuestionType {
    currentQuestion: number;
    setCurrentQuestion: (data: number) => void
}

export const useCurrentQuestionStore = create<CurrentQuestionType>((set) => ({
    currentQuestion: 0,
    setCurrentQuestion: (data: number) => set({ currentQuestion: data })
}))