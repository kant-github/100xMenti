import { Button } from "./button";
import OpacityBackground from "./OpacityBackground";
import UtilityCard from "./UtilityCard";
import { Dispatch, SetStateAction } from "react";
import { QuizType } from "@/types/types";
import { LoaderCircle } from "lucide-react";

interface DeleteQuizModalProps {
    quiz: QuizType
    setOpenDeleteQuizModal: Dispatch<SetStateAction<boolean>>;
    deleteQuizHandler: (quizId: string) => void;
    loading: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteQuizModal({ setOpenDeleteQuizModal, deleteQuizHandler, quiz, loading, setOpen }: DeleteQuizModalProps) {
    return (
        <OpacityBackground className="z-50 bg-black/20 backdrop-blur-[1px]" onBackgroundClick={() => setOpenDeleteQuizModal(false)}>
            <UtilityCard className="relative z-[100] bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                        Delete &quot;{quiz.title}&quot;
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Ready to start this quiz? You&apos;ll be able to track your progress and see results at the end.
                    </p>
                </div>

                <div
                    className={`gap-3 w-full transition-all duration-300`}
                >
                    <Button
                        variant={'destructive'}
                        disabled={loading}
                        onClick={() => deleteQuizHandler(quiz.id)}
                        className="transition-all duration-300 flex items-center justify-center gap-3 px-6 py-5 text-sm font-medium rounded-xl w-full"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-x-2">
                                <LoaderCircle className="animate-spin" />
                                <span>Deleting...</span>
                            </span>
                        ) : (
                            <span>Delete Quiz</span>
                        )}
                    </Button>
                </div>

            </UtilityCard>
        </OpacityBackground>
    )
}