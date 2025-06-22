'use client'

import { useSession } from "next-auth/react";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import { useSessionStore } from "@/zustand/sessionZustand";
import { useEffect, useMemo } from "react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html suppressHydrationWarning={true} lang="en">
      <SessionProvider>
        <body className={`bg-neutral-100 dark:bg-neutral-900`}>
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
