'use client'

import { Toaster } from "@/components/toast/toaster";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html suppressHydrationWarning={true} lang="en">
      <SessionProvider>
        <Toaster />
        <body className={`bg-neutral-100 dark:bg-neutral-900`}>
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
