import { useQuizCreationStepsStore } from "@/zustand/quizCreationStep";
import { useCurrentQuestionStore, useQuizDataStore } from "@/zustand/quizStore";
import { useSessionStore } from "@/zustand/sessionZustand";
import axios from "axios";
import { CREATE_QUIZ_URL } from "@/lib/api_routes";
import { useNewQuizIdStore } from "@/zustand/newQuizIdStore";
import { useState } from "react";
import { HiCollection } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { BiSolidMessageEdit } from "react-icons/bi";
import UtilityCard from "../ui/UtilityCard";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { Button } from "../ui/button";
import { Template } from "@/lib/templates";
import { IoIosCheckmark } from "react-icons/io";

enum Renderer {
    THEME = 'THEME',
    QUESTION = 'QUESTION'
}

export default function RightPanel({ template }: { template: Template }) {
    const [showPanel, setShowPanel] = useState<Renderer | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { currentStep, setCurrentStep } = useQuizCreationStepsStore();
    const { session } = useSessionStore();
    const { newQuizId } = useNewQuizIdStore()
    const { quizData, setQuizData, updateQuizField, updateQuestionField, updateOption, addQuestion } = useQuizDataStore();

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

    console.log("show panel is : ", showPanel);

    return (
        <div className="min-h-full flex justify-end p-4 ">
            <div className="flex gap-x-3 w-full max-w-4xl flex-row-reverse rounded-l-xl">
                <div className="w-[6rem] flex-shrink-0">
                    <div className="bg-neutral-100 rounded-xl overflow-hidden p-1 h-full">
                        <button
                            type="button"
                            onClick={() => setShowPanel(Renderer.QUESTION)}
                            className={`w-full h-20 flex items-center justify-center rounded-xl ${showPanel === Renderer.QUESTION ? "hover:bg-purple-700/10 bg-purple-400/10 border border-purple-800" : "hover:bg-neutral-200"}`}
                        >
                            <div className="flex flex-col items-center justify-center gap-y-1">
                                <BiSolidMessageEdit className="w-6 h-6" />
                                <span className="text-neutral-900 text-xs">Question</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowPanel(Renderer.THEME)}
                            className={`w-full h-20 flex items-center justify-center rounded-xl ${showPanel === Renderer.THEME ? "hover:bg-purple-700/10 bg-purple-400/10 border border-purple-800" : "hover:bg-neutral-200"}`}
                        >
                            <div className="flex flex-col items-center justify-center gap-y-1">
                                <HiCollection className="w-6 h-6" />
                                <span className="text-neutral-900 text-xs">Theme</span>
                            </div>
                        </button>
                    </div>
                </div>


                {
                    showPanel && (
                        <UtilityCard className=" bg-neutral-100 rounded-xl overflow-hidden h-full min-w-[25rem] p-4">
                            {(showPanel === Renderer.QUESTION) && (
                                <div className="h-full flex flex-col gap-y-2">

                                    <div className="flex items-center justify-between w-full flex-row p-2">
                                        <span>Question</span>
                                        <IoCloseOutline size={22} onClick={() => setShowPanel(null)} />
                                    </div>
                                    <hr className="border-[0.5px] border-neutral-300" />
                                    <div className="w-full flex items-center justify-evenly mt-4 text-neutral-900 text-sm">
                                        <Button className="bg-neutral-200 p-1 rounded-lg border border-neutral-300">
                                            <GoChevronLeft size={20} />
                                        </Button>
                                        <span> Question {currentQuestion + 1} of {quizData.totalQuestions}</span>
                                        <Button className="bg-neutral-200 p-1 rounded-lg border border-neutral-300">
                                            <GoChevronRight size={20} />
                                        </Button>
                                        <Button onClick={addQuestion} className="bg-neutral-200 border border-neutral-300 rounded-lg">Add Question</Button>
                                    </div>

                                    <textarea
                                        value={currentQ?.question || ''}
                                        onChange={(e) => updateQuestionField(currentQuestion, 'question', e.target.value)}
                                        className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-xl outline-none bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        rows={3}
                                        placeholder="Type your question here..."
                                        key={`question-${currentQuestion}`}
                                    />
                                    <div className="w-full flex items-center justify-end">
                                        <div className="flex items-center gap-x-1 flex-shrink-0 px-2 py-1 border border-purple-800 bg-purple-800/10 rounded-lg mr-1">
                                            <IoIosCheckmark size={16} />
                                            <span className="text-xs text-purple-900">select the correct answer</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {currentQ?.options.map((option, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 border border-neutral-300 rounded-xl hover:bg-gray-50 transition">
                                                <input
                                                    style={{ backgroundColor: `${template.bars[idx]}` }}
                                                    aria-label={`Select option ${String.fromCharCode(65 + idx)} as correct answer`}
                                                    type="radio"
                                                    name={`correctAnswer-${currentQuestion}`}
                                                    checked={currentQ.correctAnswer === idx}
                                                    onChange={() => updateQuestionField(currentQuestion, 'correctAnswer', idx)}
                                                    className="appearance-none w-5 h-5 rounded-full checked:border-2 checked:border-violet-600 outline-none focus:outline-none ring-0 cursor-pointer"
                                                />
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => updateOption(currentQuestion, idx, e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg focus:border-transparent text-sm outline-none transition"
                                                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                                        key={`option-${currentQuestion}-${idx}`}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="p-1 text-gray-400 hover:text-red-500 transition"
                                                    aria-label={`Remove option ${String.fromCharCode(65 + idx)}`}
                                                >
                                                    <IoCloseOutline size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-neutral-800 flex-1 rounded-xl flex items-center justify-center">
                                        <span className="text-xs text-wrap text-neutral-300">choose a display image for this question</span>
                                    </div>
                                </div>
                            )}
                            {(showPanel === Renderer.THEME) && (
                                <div className="h-full">

                                    <div className="flex items-center justify-between w-full flex-row p-2">
                                        <span>Themes</span>
                                        <IoCloseOutline size={22} onClick={() => setShowPanel(null)} />
                                    </div>

                                </div>
                            )}
                        </UtilityCard>
                    )
                }

            </div>
        </div>
    );

}