import { RxCross2 } from "react-icons/rx";
import { useCurrentQuestionStore, useQuizDataStore } from '@/zustand/useQuizDataStore';
import { IoIosCheckmark } from "react-icons/io";
import { BookOpen, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import templates from "@/lib/templates";
import { useSessionStore } from "@/zustand/sessionZustand";
import QuestionCanvas from "../ui/QuestionCanvas";
import DesignElementsBackground from "../ui/DesignElementsBackground";


export default function LeftPanel() {
    const { quizData } = useQuizDataStore();
    const { currentQuestion } = useCurrentQuestionStore();
    const currentQ = quizData.questions[currentQuestion];
    const selectedTemplate = templates.find(t => t.id === quizData.template);
    const { session } = useSessionStore();
    const [votes, setVotes] = useState([0, 0, 0, 0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setVotes(prev => {
                return prev.map(() => {
                    return Math.floor(Math.random() * 80) + 10;
                });
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [currentQuestion]);

    return (
        <div className={`h-full overflow-hidden w-full`}>
            <div className="h-full shadow-lg flex flex-col items-center justify-center px-4 w-full">

                <div className="text-center mb-8 lg:my-5 relative z-10 rounded-xl bg-neutral-100 w-full max-w-4xl py-4 border-[1px] border-neutral-300">
                    <h1 className="text-center text-2xl lg:text-3xl font-normal mb-2">{quizData.title}</h1>
                    <div className="flex items-center justify-center gap-4 lg:gap-6 text-sm lg:text-base font-light">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{currentQ?.timing || quizData.timing}s per question</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{quizData.totalQuestions} questions</span>
                        </div>
                    </div>
                </div>

                {/* FIXED CONTAINER - Now has consistent dimensions */}
                <QuestionCanvas template={selectedTemplate} className="w-full max-w-4xl h-[500px] sm:h-[550px] lg:h-[600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 rounded-lg flex flex-col"

                >
                    <DesignElementsBackground
                        design={selectedTemplate.design}
                        accentColor={selectedTemplate.designColor}
                    />

                    <div className="text-center mb-6 lg:mb-8 flex-shrink-0">
                        <div className="text-sm lg:text-base font-medium mb-2">
                            Question {currentQuestion + 1}
                        </div>
                        <div className="h-20 sm:h-24 lg:h-28 flex items-center justify-center">
                            <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] leading-relaxed text-center px-2 w-[99%] overflow-hidden font-light tracking-wide">
                                {currentQ?.question}
                            </h2>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-full max-w-3xl h-full flex items-end justify-center gap-4">
                                {
                                    currentQ?.options?.map((option, idx) => (
                                        <div key={idx} className="flex flex-col items-center h-full justify-end flex-1 max-w-[200px]">
                                            <div className="flex items-center justify-start gap-x-1 sm:gap-x-2 mb-2 whitespace-nowrap w-full">
                                                <div className="flex-shrink-0">
                                                    {currentQ.correctAnswer === idx ? (
                                                        <IoIosCheckmark size={16} className="sm:w-[18px] sm:h-[18px] text-green-600 bg-green-200 rounded-full border-[0.5px] border-green-500" />
                                                    ) : (
                                                        <RxCross2 className="bg-red-300 rounded-full p-1 text-red-950 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                                    )}
                                                </div>
                                                <span className="text-sm sm:text-base lg:text-lg font-medium">{Math.round(votes[idx])}</span>
                                            </div>
                                            <div
                                                className={`w-full rounded-tr-xl transition-all duration-1000 ease-in-out`}
                                                style={{
                                                    height: `${Math.max(votes[idx] * 2.5, 12)}px`,
                                                    minWidth: '60px',
                                                    maxWidth: '180px',
                                                    backgroundColor: `${selectedTemplate.bars[idx]}FF`
                                                }}
                                            />

                                            {/* Option label at the bottom - Fixed height */}
                                            <div className="mt-2 h-8 flex items-center justify-center">
                                                <div className="text-xs sm:text-sm text-center px-1 leading-tight font-light">
                                                    {option.length > 12 ? `${option.substring(0, 12)}...` : option}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </QuestionCanvas>

                <div className="my-6 lg:mt-8 flex justify-center">
                    <div className="flex items-center gap-2 text-neutral-950">
                        <Clock className="w-4 h-4" />
                        <div className="text-sm">Time: {currentQ?.timing || quizData.timing} seconds</div>
                    </div>
                </div>
            </div>
        </div>
    );
};