import { ChevronLeft, ChevronRight, Edit3, Loader2, Play, Plus } from "lucide-react";
import { useQuizCreationStepsStore } from "@/zustand/quizCreationStep";
import { useCurrentQuestionStore, useQuizDataStore } from "@/zustand/quizStore";
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
            await new Promise(t => setTimeout(t, 3000));
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
        <div className="min-h-screen flex flex-col bg-neutral-100 flex-1 rounded-l-xl overflow-hidden py-4 border-l-[1px] border-neutral-300">
            {/* Form Header */}
            <div className="border-b-[1px] border-neutral-300 px-4 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-neutral-900" />
                        <span className="font-medium">Quiz Editor</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={createQuizHandler}
                            className="min-w-[120px] px-6 py-5 bg-neutral-900 text-white hover:bg-neutral-800 transition rounded-xl  disabled:bg-neutral-900 disabled:text-white disabled:opacity-100 disabled:cursor-default"
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
            </div>

            {/* Step Navigation */}
            <div className="bg-neutral-100 p-4">
                <div className="flex items-center gap-4">
                    <Button
                        type='button'
                        onClick={() => setCurrentStep(1)}
                        variant="outline" className={`min-w-[120px] px-6 py-5 text-neutral-900 border border-neutral-300 bg-neutral-200  transition rounded-xl flex items-center justify-center gap-x-2 text-xs ${currentStep === 1 && 'border border-blue-400'} `}
                    >
                        Setup
                    </Button>
                    <Button
                        type='button'
                        onClick={() => setCurrentStep(2)}
                        variant="outline" className={`min-w-[120px] px-6 py-5 text-neutral-900 border border-neutral-300 bg-neutral-200  transition rounded-xl flex items-center justify-center gap-x-2 text-xs ${currentStep === 2 && 'border border-blue-400'} `}
                    >
                        Questions
                    </Button>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {currentStep === 1 ? (
                    // Setup Form
                    <UtilityCard className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quiz Title
                            </label>
                            <input
                                type="text"
                                value={quizData.title}
                                onChange={(e) => updateQuizField('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none bg-neutral-200 text-sm font-light"
                                placeholder="Enter quiz title..."
                                key="quiz-title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Choose Template
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        onClick={() => updateQuizField('template', template.id)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${quizData.template === template.id
                                            ? 'border-blue-500 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className={`w-full h-12 rounded mb-2`}
                                            style={{
                                                backgroundColor: template.bg
                                            }}
                                        />
                                        <div className="text-xs font-medium text-neutral-950">
                                            {template.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Default Time per Question (seconds)
                            </label>
                            <input
                                aria-label='s'
                                type="number"
                                min="10"
                                max="300"
                                value={quizData.timing}
                                onChange={(e) => updateQuizField('timing', parseInt(e.target.value) || 30)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                key="quiz-timing"
                            />
                        </div>

                        <button
                            type='button'
                            onClick={() => setCurrentStep(2)}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            Continue to Questions
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </UtilityCard>
                ) : (
                    // Questions Form
                    <div className="space-y-6 bg-neutral-100 p-4 rounded-xl">
                        {/* Question Navigation */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    aria-label='left'
                                    type='button'
                                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                    disabled={currentQuestion === 0}
                                    className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-medium">
                                    Question {currentQuestion + 1} of {quizData.totalQuestions}
                                </span>
                                <button
                                    type='button'
                                    aria-label='left'
                                    onClick={() => setCurrentQuestion(Math.min(quizData.questions.length - 1, currentQuestion + 1))}
                                    disabled={currentQuestion === quizData.questions.length - 1}
                                    className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <Button onClick={addQuestion} variant="outline" className="min-w-[120px] px-6 py-5 text-neutral-900 border border-neutral-300 bg-neutral-300  transition rounded-xl flex items-center justify-center gap-x-2 text-xs">
                                <Plus />
                                Add Question
                            </Button>
                        </div>

                        {/* Question Form */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question
                            </label>
                            <textarea
                                value={currentQ?.question || ''}
                                onChange={(e) => updateQuestionField(currentQuestion, 'question', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none bg-neutral-200 text-sm font-light"
                                rows={3}
                                placeholder="Type your question here..."
                                key={`question-${currentQuestion}`}
                            />
                        </div>

                        {/* Options */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Answer Options
                            </label>
                            <div className="space-y-2">
                                {currentQ?.options.map((option, idx) => (
                                    <div key={idx} className="flex items-center gap-3 w-[80%]">
                                        <input
                                            aria-label='s'
                                            type="radio"
                                            name={`correctAnswer-${currentQuestion}`}
                                            checked={currentQ.correctAnswer === idx}
                                            onChange={() => updateQuestionField(currentQuestion, 'correctAnswer', idx)}
                                            className="appearance-none w-[22px] h-[22px] border border-neutral-300 rounded-sm bg-white checked:bg-violet-500 checked:border-violet-600 outline-none focus:outline-none ring-0 focus:ring-0 focus:ring-offset-2 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:top-0 checked:after:left-0 checked:after:w-full checked:after:h-full checked:after:flex checked:after:items-center checked:after:justify-center"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => updateOption(currentQuestion, idx, e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg focus:ring-0 focus:border-transparent bg-neutral-200 text-sm font-light outline-none"
                                                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                                key={`option-${currentQuestion}-${idx}`}
                                            />
                                        </div>
                                        <RxCross2 size={14} />
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                Select the checkbox next to the correct answer
                            </div>
                        </div>

                        {/* Question Timing */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time Limit (seconds)
                            </label>
                            <input
                                aria-label='s'
                                type="number"
                                min="10"
                                max="300"
                                value={currentQ?.timing || quizData.timing}
                                onChange={(e) => updateQuestionField(currentQuestion, 'timing', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-neutral-200 text-sm font-light"
                            />
                        </div>

                        {/* Launch Quiz Button */}
                        <div className="pt-4 border-t">
                            <button type='button' className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                <Play className="w-4 h-4" />
                                Launch Quiz
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}