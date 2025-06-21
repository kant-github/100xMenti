import { Dispatch, SetStateAction, useState } from "react";
import UtilitySideBar from "../ui/UtilitySideBar";
import { ChevronLeft, ChevronRight, Edit3, Play } from "lucide-react";
import { useQuizCreationStepsStore } from "@/zustand/quizCreationStep";
import { templates } from "./Panels";
import { useQuizDataStore } from "@/zustand/quizStore";

interface RightPanelProps {
    openRightPanel: boolean;
    setOpenRightPanel: Dispatch<SetStateAction<boolean>>;
}

export default function RightPanel({ openRightPanel, setOpenRightPanel }: RightPanelProps) {
    const { currentStep, setCurrentStep } = useQuizCreationStepsStore();
    const {
        quizData,
        updateQuizField,
        updateQuestionField,
        updateOption,
        addQuestion
    } = useQuizDataStore();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const currentQ = quizData.questions[currentQuestion];

    return (
        <div className="min-h-screen flex flex-col bg-neutral-100 flex-1 rounded-l-xl overflow-hidden py-4">
            {/* Form Header */}
            <div className="border-b px-4 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Quiz Editor</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type='button' className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Save Draft
                        </button>
                    </div>
                </div>
            </div>

            {/* Step Navigation */}
            <div className="bg-white border-b p-4">
                <div className="flex items-center gap-4">
                    <button
                        type='button'
                        onClick={() => setCurrentStep(1)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentStep === 1 ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Setup
                    </button>
                    <button
                        type='button'
                        onClick={() => setCurrentStep(2)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentStep === 2 ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Questions
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {currentStep === 1 ? (
                    // Setup Form
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quiz Title
                            </label>
                            <input
                                type="text"
                                value={quizData.title}
                                onChange={(e) => updateQuizField('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        <div className={`w-full h-12 ${template.bg} rounded mb-2`} />
                                        <div className="text-sm font-medium text-gray-800">
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
                    </div>
                ) : (
                    // Questions Form
                    <div className="space-y-6">
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
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                                + Add Question
                            </button>
                        </div>

                        {/* Question Form */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question
                            </label>
                            <textarea
                                value={currentQ?.question || ''}
                                onChange={(e) => updateQuestionField(currentQuestion, 'question', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            <div className="space-y-3">
                                {currentQ?.options.map((option, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <input
                                            aria-label='s'
                                            type="radio"
                                            name={`correctAnswer-${currentQuestion}`}
                                            checked={currentQ.correctAnswer === idx}
                                            onChange={() => updateQuestionField(currentQuestion, 'correctAnswer', idx)}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => updateOption(currentQuestion, idx, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                                key={`option-${currentQuestion}-${idx}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                Select the radio button next to the correct answer
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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