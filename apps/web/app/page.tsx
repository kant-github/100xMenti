'use client'
import NavBar from "../src/components/navbar/NavBar"
import { useSessionStore } from "@/zustand/sessionZustand";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import QuizDashboard from "@/components/ui/QuizDashboard";

export default function Home() {
  const { data: sessionData, status } = useSession();
  const { setSession } = useSessionStore();


  useEffect(() => {
    if (status !== 'loading' && sessionData) {
      setSession(sessionData);
    }
  }, [sessionData, status, setSession]);

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 h-screen">
      <NavBar />
      <QuizDashboard />
    </div>
  );
}