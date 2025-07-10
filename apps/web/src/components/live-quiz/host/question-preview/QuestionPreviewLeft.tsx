import DesignElementsBackground from "@/components/ui/DesignElementsBackground";
import templates, { Template } from "@/lib/templates"
import { useLiveQuestionPreviewCount } from "@/zustand/live-quiz-store/useLiveQuestionPreviewCount";
import { useLiveQuizDataStore } from "@/zustand/liveQuizStore"
import { IoIosCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

interface QuestionPreviewLeftProps {
    selectedTemplate: Template
}

export default function QuestionPreviewLeft({ selectedTemplate }: QuestionPreviewLeftProps) {
    const { liveQuiz } = useLiveQuizDataStore()
    const { currentQuestionIx } = useLiveQuestionPreviewCount();
    const currentQ = liveQuiz.questions[currentQuestionIx];

    return (
        <div className="w-full max-w-5xl h-screen max-h-[900px] flex items-center justify-center relative">
            <div className="w-full max-w-4xl h-[500px] sm:h-[550px] lg:h-[550px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 rounded-lg flex flex-col"
                style={{
                    backgroundColor: selectedTemplate.bg,
                    color: selectedTemplate.textColor
                }}
            >
                <DesignElementsBackground
                    design={selectedTemplate.design}
                    accentColor={selectedTemplate.accent}
                />

                <div className="relative z-10">
                    <div className="text-center font-normal text-3xl">{currentQ.title}</div>
                </div>

                <div className="w-full max-w-3xl h-full flex items-end justify-center gap-4 relative z-10">
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
                                </div>
                                <div
                                    className={`w-full rounded-tr-xl transition-all duration-1000 ease-in-out`}
                                    style={{
                                        height: `${12}px`,
                                        minWidth: '60px',
                                        maxWidth: '180px',
                                        backgroundColor: selectedTemplate.bars[idx]
                                    }}
                                />

                                <div className="mt-2 h-8 flex items-center justify-center">
                                    <div className="text-xs sm:text-sm text-neutral-950 text-center px-1 leading-tight font-light">
                                        {option.length > 12 ? `${option.substring(0, 12)}...` : option}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}