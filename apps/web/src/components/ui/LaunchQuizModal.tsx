import { Button } from "./button";
import OpacityBackground from "./OpacityBackground";
import UtilityCard from "./UtilityCard";
import { Dispatch, SetStateAction } from "react";
import { QuizType } from "@/types/types";

interface LaunchQuizModalProps {
    quiz: QuizType
    setOpenLaunchQuizModal: Dispatch<SetStateAction<boolean>>;
    launchQuizHandler: (quizId: string) => void;
}

export default function LaunchQuizModal({ setOpenLaunchQuizModal, launchQuizHandler, quiz }: LaunchQuizModalProps) {
    return (
        <OpacityBackground className="z-50 bg-black/20 backdrop-blur-[1px]" onBackgroundClick={() => setOpenLaunchQuizModal(false)}>
            <UtilityCard className="relative z-[100] bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                        Launch "{quiz.title}"
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Ready to start this quiz? You'll be able to track your progress and see results at the end.
                    </p>
                </div>

                <div className="flex gap-3 w-full">
                    <Button
                        onClick={() => launchQuizHandler(quiz.id)}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                    >
                        <span>Start Quiz</span>
                    </Button>
                    <Button
                        onClick={() => setOpenLaunchQuizModal(false)}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-5 text-sm font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl border-[1px] border-neutral-200"
                    >
                        <span className="text-neutral-900 dark:text-white">Cancel</span>
                    </Button>
                </div>
            </UtilityCard>
        </OpacityBackground>
    )
}