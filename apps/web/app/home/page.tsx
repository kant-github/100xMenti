'use client'

import DashNav from "@/components/navbar/DashNav"
import HomeMainSection from "@/components/ui/HomeMainSection"
import { GET_OWNER_QUIZS_URL } from "@/lib/api_routes";
import { useOwnerQuizsStore } from "@/zustand/ownerQuizsStore";
import { useSessionStore } from "@/zustand/sessionZustand";
import axios from "axios";
import { useEffect } from "react";

export default function Home() {
    const { setQuizs, resetQuizs } = useOwnerQuizsStore();
    const { session } = useSessionStore();

    async function getOwnerQuizs() {
        if (!session?.user?.token) {
            console.log("No session or token available");
            return;
        }
        try {
            const { data } = await axios.get(`${GET_OWNER_QUIZS_URL}`, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                }
            });

            if (data.data) {
                resetQuizs();
                setQuizs(data.data);
            }
        } catch (err) {
            console.error("Error in getting the data", err);
        }
    }

    useEffect(() => {
        if (session && session?.user?.token) {
            getOwnerQuizs();
        }
    }, [session]);

    return (
        <div>
            <DashNav />
            <HomeMainSection />
        </div>
    )
}