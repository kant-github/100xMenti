import { SessionProvider as NextSessionProvider } from 'next-auth/react'

interface SessionProviderProps {
    children: React.ReactNode
}

export default function SessionProvider({ children }: SessionProviderProps) {
    return (
        <NextSessionProvider>
            {children}
        </NextSessionProvider>
    )
}