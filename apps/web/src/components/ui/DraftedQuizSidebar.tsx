import { Dispatch, SetStateAction } from "react";
import UtilitySideBar from "./UtilitySideBar";
import Heading from "./Heading";
import { useOwnerQuizsStore } from "@/zustand/ownerQuizsStore";
import QuizCard from "./QuizCard";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid'
import { useSessionStore } from "@/zustand/sessionZustand";

interface DraftedQuizSidebarProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DraftedQuizSidebar({ open, setOpen }: DraftedQuizSidebarProps) {
    const { quizs } = useOwnerQuizsStore();
    const { session } = useSessionStore();
    const router = useRouter()
    function createQuizHandler() {
        const uuid = uuidv4();
        router.push(`/quiz/${uuid}`);
    }

    return (
        <UtilitySideBar
            width="w-[27rem]"
            open={open}
            setOpen={setOpen}
            content={
                <div className="h-full flex flex-col">
                    {/* Header - Fixed at top */}
                    <div className="flex-shrink-0 px-6 py-4">
                        <Heading description="Quizzes you started but haven't published yet.">
                            Drafted Quizzes
                        </Heading>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto px-6 my-4">
                        {quizs.length > 0 ? (
                            <div className="gap-y-4">
                                {quizs.map((quiz) => (
                                    <QuizCard setOpen={setOpen} session={session} key={quiz.id} quiz={quiz} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    No drafted quizzes
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Start creating your first quiz to see it here.
                                </p>
                                <Button onClick={createQuizHandler} className="min-w-[120px] px-6 py-5 bg-neutral-900 text-white hover:bg-neutral-800 transition rounded-xl">
                                    Create Quiz
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            }
        />
    );
}