import { useQuizCreationStepsStore } from "@/zustand/quizCreationStep";
import { useCurrentQuestionStore, useQuizDataStore } from "@/zustand/useQuizDataStore";
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
import { MdAddReaction } from "react-icons/md";
import { MdDragIndicator } from "react-icons/md";
import { Input } from "../ui/input";
import ThemesPanel from "../ui/ThemesPanel";


export enum Renderer {
    THEME = 'THEME',
    QUESTION = 'QUESTION',
    INTERACTION = 'INTERACTION'
}

export default function RightPanel({ template }: { template: Template }) {
    const [showPanel, setShowPanel] = useState<Renderer | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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

    function handleDragStart(e: React.DragEvent, index: number) {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    function handleDrop(e: React.DragEvent, dropIndex: number) {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        }
        const currentOptions = [...currentQ.options];
        const draggedOption = currentOptions[draggedIndex];
        currentOptions.splice(draggedIndex, 1);
        currentOptions.splice(dropIndex, 0, draggedOption);
        let newCorrectAnswer = currentQ.correctAnswer;
        if (currentQ.correctAnswer === draggedIndex) {
            newCorrectAnswer = dropIndex;
        } else if (draggedIndex < currentQ.correctAnswer && dropIndex >= currentQ.correctAnswer) {
            newCorrectAnswer = currentQ.correctAnswer - 1;
        } else if (draggedIndex > currentQ.correctAnswer && dropIndex <= currentQ.correctAnswer) {
            newCorrectAnswer = currentQ.correctAnswer + 1;
        }
        updateQuestionField(currentQuestion, 'options', currentOptions);
        updateQuestionField(currentQuestion, 'correctAnswer', newCorrectAnswer);
        setDraggedIndex(null);
    };


    return (
        <div className="min-h-full flex justify-end p-4 ">
            <div className="flex gap-x-3 w-full max-w-4xl flex-row-reverse rounded-l-xl">
                <div className="w-[6rem] flex-shrink-0">
                    <div className="bg-neutral-100 rounded-xl overflow-hidden p-1 flex flex-col gap-y-2 border-[1px] border-neutral-300">
                        <Button
                            type="button"
                            onClick={() => setShowPanel(Renderer.QUESTION)}
                            className={`w-full shadow-none h-20 flex items-center justify-center rounded-xl ${showPanel === Renderer.QUESTION ? "hover:bg-purple-700/10 bg-purple-400/10 border border-purple-800" : "hover:bg-neutral-200"}`}
                        >
                            <div className="flex flex-col items-center justify-center gap-y-1">
                                <BiSolidMessageEdit className="w-6 h-6" />
                                <span className="text-neutral-900 text-xs">Question</span>
                            </div>
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setShowPanel(Renderer.THEME)}
                            className={`w-full shadow-none h-20 flex items-center justify-center rounded-xl ${showPanel === Renderer.THEME ? "hover:bg-purple-700/10 bg-purple-400/10 border border-purple-800" : "hover:bg-neutral-200"}`}
                        >
                            <div className="flex flex-col items-center justify-center gap-y-1">
                                <HiCollection className="w-6 h-6" />
                                <span className="text-neutral-900 text-xs">Theme</span>
                            </div>
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setShowPanel(Renderer.INTERACTION)}
                            className={`w-full shadow-none h-20 flex items-center justify-center rounded-xl ${showPanel === Renderer.INTERACTION ? "hover:bg-purple-700/10 bg-purple-400/10 border border-purple-800" : "hover:bg-neutral-200"}`}
                        >
                            <div className="flex flex-col items-center justify-center gap-y-1">
                                <MdAddReaction className="w-6 h-6" />
                                <span className="text-neutral-900 text-xs">Interaction</span>
                            </div>
                        </Button>
                    </div>
                </div>

                {
                    showPanel && (
                        <UtilityCard className=" bg-neutral-100 rounded-xl overflow-hidden h-full min-w-[25rem] py-4 px-6 border-[1px] border-neutral-300">
                            {(showPanel === Renderer.QUESTION) && (
                                <div className="h-full flex flex-col">

                                    <div className="flex items-center justify-between w-full flex-row p-2">
                                        <span className="text-sm font-medium">Questions</span>
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
                                        <Button onClick={addQuestion} className="bg-neutral-200 border border-neutral-300 rounded-lg text-sm font-normal">Add Question</Button>
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
                                            <div
                                                key={idx}
                                                className={`flex items-center gap-2 p-1 px-3 border border-neutral-300 rounded-xl hover:bg-gray-50 transition ${draggedIndex === idx ? 'opacity-50' : ''
                                                    }`}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, idx)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, idx)}
                                            >
                                                <div
                                                    className="cursor-grab text-gray-400 hover:text-gray-600 transition-colors p-1"
                                                    title="Drag to reorder"
                                                >
                                                    <MdDragIndicator size={16} />
                                                </div>
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
                                                        className="w-full  py-2 rounded-lg focus:border-transparent text-sm outline-none transition"
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
                                    <div className="mt-2">
                                        <div className="flex items-center justify-center gap-x-3 w-full">
                                            <span className="flex-shrink-0 text-xs text-neutral-400">Timing</span>
                                            <hr className="border-[0.5px] border-neutral-300 flex-1" />
                                        </div>
                                        <Input
                                            type="number"
                                            placeholder="Question timing"
                                            className="rounded-xl border border-neutral-300 py-5 mt-2"
                                            aria-label='Time limit in seconds'
                                            min="10"
                                            max="300"
                                            value={currentQ?.timing || quizData.timing}
                                            onChange={(e) => updateQuestionField(currentQuestion, 'timing', parseInt(e.target.value))} />
                                    </div>
                                    <div className="bg-neutral-800 flex-1 rounded-xl flex items-center justify-center">
                                        <span className="text-xs text-wrap text-neutral-300">choose a display image for this question</span>
                                    </div>
                                </div>
                            )}
                            {(showPanel === Renderer.THEME) && (
                                <ThemesPanel setShowPanel={setShowPanel} />
                            )}
                            {(showPanel === Renderer.INTERACTION) && (
                                <div className="h-full">

                                    <div className="flex items-center justify-between w-full flex-row p-2">
                                        <span>Interactivity</span>
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