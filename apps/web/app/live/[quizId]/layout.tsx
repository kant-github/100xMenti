'use client'

import { useSessionStore } from "@/zustand/sessionZustand";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Poppins } from 'next/font/google'

const roboto = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],

})
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
    <html lang="en" className={roboto.className}>
      <body className="h-full">
        {children}
      </body>
    </html>
  );
}
