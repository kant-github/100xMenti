import Image from "next/image";
import { Button } from "./button";
import OpacityBackground from "./OpacityBackground";
import UtilityCard from "./UtilityCard";
import { Dispatch, SetStateAction } from "react";
import { signIn } from "next-auth/react";

interface LoginModalProps {
    setOpenLoginModal: Dispatch<SetStateAction<boolean>>;
}

export default function LoginModal({ setOpenLoginModal }: LoginModalProps) {

    async function signinUser() {
        signIn('google', {
            redirect: false
        })
    }

    return (
        <OpacityBackground className="z-50 bg-black/20 backdrop-blur-[1px]" onBackgroundClick={() => setOpenLoginModal(false)}>
            <UtilityCard className="relative z-[100] bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                        Sign in to continue
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Log in to access your personalized dashboard, track your quiz performance, and compete with others.
                    </p>
                </div>

                <Button onClick={signinUser} className="w-full flex items-center justify-center gap-3 px-6 py-5 text-sm font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl">
                    <Image
                        src="/google-images/google.png"
                        height={24}
                        width={24}
                        alt="Google"
                        priority
                        unoptimized
                    />
                    <span className="text-neutral-900 dark:text-white">Sign in with Google</span>
                </Button>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center leading-relaxed">
                    By signing in, you agree to our
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"> Terms of Service</span> and
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"> Privacy Policy</span>
                </p>
            </UtilityCard>
        </OpacityBackground>
    )
}