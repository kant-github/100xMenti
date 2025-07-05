import { Button } from "./button";
import OpacityBackground from "./OpacityBackground";
import UtilityCard from "./UtilityCard";
import { Dispatch, SetStateAction } from "react";
import { QuizType } from "@/types/types";
import { LoaderCircle } from "lucide-react";

interface PublishQuizModalProps {
    quiz: QuizType
    setOpenPublishQuizModal: Dispatch<SetStateAction<boolean>>;
    publishQuizHandler: (quizId: string) => void;
    loading: boolean
}


export default function PublishQuizModal({ setOpenPublishQuizModal, publishQuizHandler, quiz, loading }: PublishQuizModalProps) {
    return (
        <OpacityBackground className="z-50 bg-black/20 backdrop-blur-[1px]" onBackgroundClick={() => setOpenPublishQuizModal(false)}>
            <UtilityCard className="relative z-[100] bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                        Publish &quot;{quiz.title}&quot;
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Ready to start this quiz? You&apos;ll be able to track your progress and see results at the end.
                    </p>
                </div>

                <div className="flex gap-3 w-full">
                    <Button
                        disabled={loading}
                        onClick={() => publishQuizHandler(quiz.id)}
                        className="px-6 py-5 bg-neutral-900 text-white hover:bg-neutral-800 transition rounded-xl flex-1"
                    >
                        {
                            loading ? (
                                <span className="flex items-center justify-center gap-x-2">
                                    <LoaderCircle />
                                    <span>Publishing...</span>
                                </span>
                            ) : (
                                <span>Publish Quiz</span>
                            )
                        }
                    </Button>
                </div>
            </UtilityCard>
        </OpacityBackground>
    )
}