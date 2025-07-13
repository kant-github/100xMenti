'use client'

import { Toaster } from "@/components/toast/toaster";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import { Poppins } from 'next/font/google'

const roboto = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],

})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html suppressHydrationWarning={true} lang="en">
      <body className={`bg-neutral-100 dark:bg-neutral-900 ${roboto.className}`}>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
