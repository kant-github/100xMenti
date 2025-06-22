'use client'

import { useSessionStore } from "@/zustand/sessionZustand";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SessionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: sessionData } = useSession();
  const { setSession } = useSessionStore();

  useEffect(() => {
    if (sessionData) {
      setSession(sessionData); // Assuming `sessionData` matches your Zustand type
    }
  }, [sessionData, setSession]);

  return <div>{children}</div>;
}
