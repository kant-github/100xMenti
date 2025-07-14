import DesignElementsBackground from "@/components/ui/DesignElementsBackground"
import QuestionCanvas from "@/components/ui/QuestionCanvas"
import TimerBar from "@/components/ui/TimerBar"
import UtilitySideBarTwo from "@/components/ui/UtilitySideBarTwo"
import { Template } from "@/lib/templates"
import { useLiveQuestion } from "@/zustand/live-quiz-store/useLiveQuestion"
import { useLiveQuizDataStore } from "@/zustand/liveQuizStore"

interface QuestionActiveProps {
    template: Template
}

export default function QuestionActive({ template }: QuestionActiveProps) {
    const { liveQuiz } = useLiveQuizDataStore()
    const { question } = useLiveQuestion();
    return (
        <div className="min-h-screen">
            <div className='grid grid-cols-[70%_30%]'>
                {/* left */}
                <div className="h-screen overflow-hidden w-full flex items-center justify-center">
                    <QuestionCanvas className="flex flex-col justify-evenly select-none lg:px-16" template={template}>
                        <DesignElementsBackground
                            design={template.design}
                            accentColor={template.designColor}
                        />

                        <section className="">
                            <div className="mb-3 text-md tracking-wider font-semibold leading-relaxed text-wrap">Question 1</div>
                            <div className="text-2xl tracking-wider font-light leading-relaxed text-wrap">{question?.title}</div>
                        </section>

                        {question?.timing && <TimerBar bg={template.bars[3]} className=" justify-center w-full mt-8" timer={question.timing * 1000} />}

                    </QuestionCanvas>
                </div>

                {/* Right */}
                <UtilitySideBarTwo>
                    <div className="flex-1 flex flex-col justify-start gap-y-5 px-6 py-4">
                        <section className="flex flex-col gap-y-4 flex-shrink-0">
                            <div className="flex items-center justify-start gap-x-3">
                                <div className={`cursor-pointer text-md text-neutral-700 font-light py-1 px-2 rounded-xs`}>
                                    {liveQuiz.title}
                                </div>
                            </div>
                            <hr className="border-neutral-500/50" />
                        </section>

                        {/* Question Header */}
                        <section>
                            <div className="bg-neutral-100 px-5 py-4 rounded-xl">
                                <div className="flex items-start gap-x-3 mb-4">
                                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                        Question 1 of 20
                                    </div>
                                </div>

                                {/* Question Title */}
                                <div className="font-medium tracking-wide text-neutral-900 text-wrap select-none">
                                    {question?.title}
                                </div>
                            </div>

                            {/* Options */}
                            <div className="w-full my-8">
                                <div className="flex flex-col gap-y-4 w-full">
                                    {question?.options && question.options.length > 0 && question.options.map((option, idx) => (
                                        <div key={idx} className="w-full bg-neutral-100 px-4 py-3.5 rounded-xl border-[1px] border-neutral-300 flex items-center justify-start gap-x-3">
                                            <div style={{
                                                backgroundColor: `${template.bars[idx]}`
                                            }} className="h-5 w-5 aspect-square rounded-full border-[1px] border-neutral-500"></div>
                                            <div className="text-md text-neutral-900 font-normal">{option}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                        <section className="flex-1 ">
                            <div className="bg-neutral-800 h-full rounded-xl flex items-center justify-center">
                                <span className="text-xs text-neutral-500">currently no image</span>
                            </div>
                        </section>
                    </div>
                </UtilitySideBarTwo>
            </div>
        </div>
    )
}