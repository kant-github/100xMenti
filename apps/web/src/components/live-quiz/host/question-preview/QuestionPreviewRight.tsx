import { useLiveQuizDataStore } from "@/zustand/liveQuizStore";
import InfoCard from "../../common/InfoCard";
import { useLiveQuestionPreviewCount } from "@/zustand/live-quiz-store/useLiveQuestionPreviewCount";
import { Template } from "@/lib/templates";

interface QuestionPreviewLeftProps {
    selectedTemplate: Template
}

export default function QuestionPreviewRight({ selectedTemplate }: QuestionPreviewLeftProps) {
    const { liveQuiz } = useLiveQuizDataStore();
    const { currentQuestionIx, setCurrentQuestionIx } = useLiveQuestionPreviewCount()
    const currentQ = liveQuiz.questions[currentQuestionIx];

    return (
        <div className='h-screen border-l-[1px] border-neutral-300 shadow-xl z-[60] rounded-l-xl transform transition-transform ease-in-out duration-300 overflow-hidden flex flex-col justify-evenly bg-neutral-200'>
            {/* Header Section */}
            <div className="flex flex-col gap-y-4 flex-shrink-0 p-6 pb-2">
                <div className="flex items-center justify-start gap-x-3">
                    <div className={`cursor-pointer text-md text-neutral-700 font-light py-1 px-2 rounded-xs`}>
                        {liveQuiz.title}
                    </div>
                </div>
                <hr className="border-neutral-500/50" />
                <InfoCard />
            </div>

            {/* Main Content Section */}
            <div className="flex-shrink-0flex flex-col justify-center px-6">
                {/* Question Header */}
                <div className="bg-neutral-100 px-5 py-4 rounded-xl">
                    <div className="flex items-start gap-x-3 mb-4">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                            Question {currentQuestionIx + 1} of {liveQuiz.questions.length}
                        </div>
                    </div>

                    {/* Question Title */}
                    <div className="font-semibold tracking-wide text-neutral-900">
                        {currentQ.title}
                    </div>
                </div>

                {/* Options */}
                <div className="w-full my-8">
                    <div className="flex flex-col gap-y-4 w-full">
                        {currentQ.options.map((option, idx) => (
                            <div key={idx} className="w-full bg-neutral-100 px-4 py-3.5 rounded-xl border-[1px] border-neutral-300 flex items-center justify-start gap-x-3">
                                <div style={{
                                    backgroundColor: `${selectedTemplate.bars[idx]}`
                                }} className="h-5 w-5 aspect-square rounded-full border-[1px] border-neutral-500"></div>
                                <div className="text-md text-neutral-900 font-normal">{option}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="p-2 flex justify-center">
                <div className="flex items-center gap-x-1.5 bg-neutral-100 w-fit px-4 py-3 rounded-full shadow-md">
                    <div className="text-xs text-neutral-700 font-light tracking-wide">Press</div>
                    <span className="bg-neutral-900 text-neutral-100 text-xs font-light tracking-wider px-3 py-1 rounded-lg">ENTER</span>
                    <div className="text-xs text-neutral-700 font-light tracking-wide">to launch this question</div>
                </div>
            </div>
        </div>
    )
}