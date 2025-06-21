'use client'

import NavBar from "../src/components/navbar/NavBar"
import { useSessionStore } from "@/zustand/sessionZustand";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";

export default function Home() {
  const { data: sessionData } = useSession();
  const { setSession } = useSessionStore()


  const sessionToken = useMemo(() => sessionData, [sessionData]);

  useEffect(() => {
    if (sessionToken) {
      setSession(sessionToken);
    }
  }, [sessionToken, setSession]);
  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 h-screen">
      <NavBar />
    </div>
  )
}