import { ChevronLeft, ChevronRight, Edit3, Loader2, Play, Plus } from "lucide-react";
import { useQuizCreationStepsStore } from "@/zustand/quizCreationStep";
import { useCurrentQuestionStore, useQuizDataStore } from "@/zustand/useQuizDataStore";
import { Button } from "../ui/button";
import UtilityCard from "../ui/UtilityCard";
import { RxCross2 } from "react-icons/rx";
import templates from "@/lib/templates";
import { useSessionStore } from "@/zustand/sessionZustand";
import axios from "axios";
import { CREATE_QUIZ_URL } from "@/lib/api_routes";
import { useNewQuizIdStore } from "@/zustand/newQuizIdStore";
import { useState } from "react";

export default function RightPanel() {
    const [loading, setLoading] = useState<boolean>(false);
    const { currentStep, setCurrentStep } = useQuizCreationStepsStore();
    const { session } = useSessionStore();
    const { newQuizId } = useNewQuizIdStore()
    const {
        quizData,
        setQuizData,
        updateQuizField,
        updateQuestionField,
        updateOption,
        addQuestion
    } = useQuizDataStore();

    async function createQuizHandler() {
        if (!session) {
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post(`${CREATE_QUIZ_URL}`, { ...quizData, newQuizId }, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            })
            const {
                title,
                template,
                createdAt,
                updatedAt,
                isUpdated,
                defaultTimeLimit,
                questions
            } = data.data;

            setQuizData({
                title: title,
                template: template,
                timing: defaultTimeLimit,
                totalQuestions: questions.length,
                createdAt,
                updatedAt,
                isUpdated,
                questions: questions.map(q => ({
                    id: q.id,
                    question: q.title,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    timing: q.timing
                }))
            })
        } catch (err) {
            console.log("Error while creating a quiz", err);
        } finally {
            setLoading(false);
        }
    }

    const { currentQuestion, setCurrentQuestion } = useCurrentQuestionStore();
    const currentQ = quizData.questions[currentQuestion];

    return (
        <div className="min-h-screen flex flex-col  flex-1 rounded-l-xl overflow-hidden border-l border-neutral-300">
            {/* Form Header */}
            <div className="border-b border-neutral-300 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Edit3 className="w-5 h-5 text-neutral-900" />
                        <span className="font-medium text-neutral-900">Quiz Editor</span>
                    </div>
                    <Button
                        onClick={createQuizHandler}
                        className="min-w-[120px] px-6 py-2.5 bg-neutral-900 text-white hover:bg-neutral-800 transition rounded-xl disabled:bg-neutral-900 disabled:text-white disabled:opacity-100 disabled:cursor-default"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Drafting...
                            </>
                        ) : quizData.isUpdated ? (
                            'Update Draft'
                        ) : (
                            'Save Draft'
                        )}
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <section className="flex flex-1 overflow-hidden">
                {/* Left Content Area */}
                <div className="flex flex-col flex-1">
                    {/* Step Navigation */}
                    <div className="bg-neutral-100 px-6 py-4 border-b border-neutral-200">
                        <div className="flex items-center gap-4">
                            <Button
                                type='button'
                                onClick={() => setCurrentStep(2)}
                                variant="outline"
                                className={`px-6 py-2.5 text-neutral-900 border border-neutral-300 bg-neutral-200 hover:bg-neutral-300 transition rounded-xl flex items-center justify-center gap-x-2 text-sm ${currentStep === 2 ? 'border-blue-400 bg-blue-50' : ''}`}
                            >
                                Questions
                            </Button>
                            <Button
                                type='button'
                                onClick={() => setCurrentStep(2)}
                                variant="outline"
                                className={`px-6 py-2.5 text-neutral-900 border border-neutral-300 bg-neutral-200 hover:bg-neutral-300 transition rounded-xl flex items-center justify-center gap-x-2 text-sm ${currentStep === 2 ? 'border-blue-400 bg-blue-50' : ''}`}
                            >
                                Tools
                            </Button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* Question Navigation */}
                            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-neutral-200">
                                <div className="flex items-center gap-3">
                                    <button
                                        aria-label='Previous question'
                                        type='button'
                                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                        disabled={currentQuestion === 0}
                                        className="p-2 rounded-lg border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm font-medium text-neutral-700">
                                        {currentQuestion + 1} of {quizData.totalQuestions}
                                    </span>
                                    <button
                                        type='button'
                                        aria-label='Next question'
                                        onClick={() => setCurrentQuestion(Math.min(quizData.questions.length - 1, currentQuestion + 1))}
                                        disabled={currentQuestion === quizData.questions.length - 1}
                                        className="p-2 rounded-lg border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <Button
                                    onClick={addQuestion}
                                    variant="outline"
                                    className="px-6 py-2.5 text-neutral-900 border border-neutral-300 bg-neutral-200 hover:bg-neutral-300 transition rounded-xl flex items-center justify-center gap-x-2 text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Question
                                </Button>
                            </div>

                            {/* Question Form */}
                            <div className="bg-neutral-100 rounded-xl space-y-6">
                                {/* Question Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Question
                                    </label>
                                    <textarea
                                        value={currentQ?.question || ''}
                                        onChange={(e) => updateQuestionField(currentQuestion, 'question', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        rows={3}
                                        placeholder="Type your question here..."
                                        key={`question-${currentQuestion}`}
                                    />
                                </div>

                                {/* Options */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Answer Options
                                    </label>
                                    <div className="space-y-3">
                                        {currentQ?.options.map((option, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                                                <input
                                                    aria-label={`Select option ${String.fromCharCode(65 + idx)} as correct answer`}
                                                    type="radio"
                                                    name={`correctAnswer-${currentQuestion}`}
                                                    checked={currentQ.correctAnswer === idx}
                                                    onChange={() => updateQuestionField(currentQuestion, 'correctAnswer', idx)}
                                                    className="appearance-none w-5 h-5 border-2 border-neutral-300 rounded-full bg-white checked:bg-violet-500 checked:border-violet-600 outline-none focus:outline-none ring-0 focus:ring-2 focus:ring-violet-200 focus:ring-offset-2 relative checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:w-2 checked:after:h-2 checked:after:bg-white checked:after:rounded-full transition"
                                                />
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => updateOption(currentQuestion, idx, e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm outline-none border border-gray-200 transition"
                                                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                                        key={`option-${currentQuestion}-${idx}`}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="p-1 text-gray-400 hover:text-red-500 transition"
                                                    aria-label={`Remove option ${String.fromCharCode(65 + idx)}`}
                                                >
                                                    <RxCross2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-3">
                                        Select the radio button next to the correct answer
                                    </div>
                                </div>

                                {/* Question Timing */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Time Limit (seconds)
                                    </label>
                                    <input
                                        aria-label='Time limit in seconds'
                                        type="number"
                                        min="10"
                                        max="300"
                                        value={currentQ?.timing || quizData.timing}
                                        onChange={(e) => updateQuestionField(currentQuestion, 'timing', parseInt(e.target.value))}
                                        className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm outline-none transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar (previously red section) */}
                <div className="w-20 min-w-20 max-w-20 flex-shrink-0 bg-neutral-200 border-l border-neutral-300 flex flex-col items-center py-6">
                    <div className="text-xs text-neutral-600 writing-mode-vertical-rl text-orientation-mixed">
                        Tools
                    </div>
                </div>
            </section>
        </div>
    )
}