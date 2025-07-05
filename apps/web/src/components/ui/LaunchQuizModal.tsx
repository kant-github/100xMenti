import { Button } from "./button";
import OpacityBackground from "./OpacityBackground";
import UtilityCard from "./UtilityCard";
import { Dispatch, SetStateAction } from "react";
import { QuizType } from "@/types/types";
import { LoaderCircle } from "lucide-react";

interface LaunchQuizModalProps {
    quiz: QuizType
    setOpenLaunchQuizModal: Dispatch<SetStateAction<boolean>>;
    launchQuizHandler: (quizId: string) => void;
    loading: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function LaunchQuizModal({ setOpenLaunchQuizModal, launchQuizHandler, quiz, loading, setOpen }: LaunchQuizModalProps) {
    return (
        <OpacityBackground className="z-50 bg-black/20 backdrop-blur-[1px]" onBackgroundClick={() => setOpenLaunchQuizModal(false)}>
            <UtilityCard className="relative z-[100] bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                        Launch &quot;{quiz.title}&quot;
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Ready to start this quiz? You&apos;ll be able to track your progress and see results at the end.
                    </p>
                </div>

                <div
                    className={`gap-3 w-full grid transition-all duration-300 ${loading ? "grid-cols-1" : "grid-cols-2"
                        }`}
                >
                    <Button
                        disabled={loading}
                        onClick={() => launchQuizHandler(quiz.id)}
                        className="transition-all duration-300 flex items-center justify-center gap-3 px-6 py-5 text-sm font-medium bg-neutral-900 hover:bg-neutral-700 text-white rounded-xl w-full"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-x-2">
                                <LoaderCircle className="animate-spin" />
                                <span>Launching...</span>
                            </span>
                        ) : (
                            <span>Launch Quiz</span>
                        )}
                    </Button>

                    {!loading && (
                        <Button
                            disabled={loading}
                            onClick={() => {
                                setOpenLaunchQuizModal(false);
                                setOpen(true);
                            }}
                            className="transition-all duration-300 flex items-center justify-center gap-3 px-6 py-5 text-sm font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl border-[1px] border-neutral-200 w-full"
                        >
                            <span className="text-neutral-900 dark:text-white">Cancel</span>
                        </Button>
                    )}
                </div>

            </UtilityCard>
        </OpacityBackground>
    )
}