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
      setSession(sessionData);
    }
  }, [sessionData, setSession]);

  return (
    <html lang="en">
      <body className="h-full">
        {children}
      </body>
    </html>
  );
}
