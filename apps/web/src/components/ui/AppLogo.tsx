'use client'

import { cn } from "@/lib/utils"

interface AppLogoProps {
    className?: string
}

export default function AppLogo({ className }: AppLogoProps) {
    return (
        <div className={cn("text-xl flex items-center justify-center font-black",
            className
        )}>

            <span className="text-stroke text-neutral-600">100</span>
            <span className="text-blue-600">x</span>
            <span>Menti</span>

        </div>
    )
}