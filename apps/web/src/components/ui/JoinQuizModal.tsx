import Image from "next/image";
import { Button } from "./button";
import OpacityBackground from "./OpacityBackground";
import UtilityCard from "./UtilityCard";
import { Dispatch, SetStateAction } from "react";
import { signIn } from "next-auth/react";
import { Input } from "./input";

interface JoinQuizModalProps {
    setOpenJoinQuizModal: Dispatch<SetStateAction<boolean>>;
}

export default function JoinQuizModal({ setOpenJoinQuizModal }: JoinQuizModalProps) {

    return (
        <OpacityBackground
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]"
            onBackgroundClick={() => setOpenJoinQuizModal(false)}
        >
            <UtilityCard className="relative bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
                        Join a Quiz
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Enter your unique quiz code below to participate instantly. Make sure you're logged in to track your results.
                    </p>
                </div>

                <Input placeholder="Enter Quiz Code" className="w-full px-5 py-5 text-base rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400" />
                <Button className="min-w-[120px] px-5 py-6 bg-neutral-900 text-white hover:bg-neutral-800 transition rounded-xl w-full">
                    Join Quiz
                </Button>
            </UtilityCard>
        </OpacityBackground>
    );
}
