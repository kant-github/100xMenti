'use client'

import { cn } from "@/lib/utils"
import { GiWoodenSign } from "react-icons/gi";


interface AppLogoProps {
    className?: string
}

export default function AppLogo({ className }: AppLogoProps) {
    return (
        <div className={cn("text-xl flex items-center justify-center gap-x-2 font-black",
            className
        )}>
            <GiWoodenSign size={35} className="text-red-700" />
            <div className="flex items-center gap-x-0.5 text-neutral-900">
                <span className="">100</span>
                <span className="text-red-700">x</span>
                <span className="">Menti</span>
            </div>
        </div>
    )
}