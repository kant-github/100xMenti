'use client'
import localFont from "next/font/local";

import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en">
      <SessionProvider>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
