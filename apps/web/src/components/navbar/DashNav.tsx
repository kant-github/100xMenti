'use client'
import { useState } from "react";
import AppLogo from "../ui/AppLogo";
import { Button } from "../ui/button";
import { useSessionStore } from "@/zustand/sessionZustand";
import LoginModal from "../ui/LoginModal";
import JoinQuizModal from "../ui/JoinQuizModal";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import ProfileModal from "../ui/ProfileModal";



export default function DashNav() {
    const { session } = useSessionStore();
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [openQuizModal, setOpenJoinQuizModal] = useState<boolean>(false);

    const router = useRouter()
    function createQuizHandler() {
        const uuid = uuidv4();
        router.push(`/quiz/${uuid}`);
    }

    console.log(session);
    return (
        <div className="w-full h-20 bg-neutral-100 flex items-center justify-between px-12">
            <AppLogo />
            <div className="flex items-center justify-center gap-4">
                <Button onClick={() => setOpenJoinQuizModal(true)} className="min-w-[120px] px-6 py-5 bg-neutral-900 text-white hover:bg-neutral-800 transition rounded-xl">
                    Join Quiz
                </Button>
                {session && (
                    <Button onClick={createQuizHandler} variant="outline" className="min-w-[120px] px-6 py-5 text-neutral-900 border border-neutral-300 hover:bg-neutral-100 transition rounded-xl">
                        Create
                    </Button>
                )}

                <ProfileModal />
            </div>
            {openLoginModal && (<LoginModal setOpenLoginModal={setOpenLoginModal} />)}
            {openQuizModal && (<JoinQuizModal setOpenJoinQuizModal={setOpenJoinQuizModal} />)}
        </div>
    )
}