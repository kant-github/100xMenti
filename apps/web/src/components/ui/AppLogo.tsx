'use client'

import { cn } from "@/lib/utils"
import { GiBestialFangs } from "react-icons/gi";

interface AppLogoProps {
    className?: string
}

export default function AppLogo({ className }: AppLogoProps) {
    return (
        <div className={cn("text-xl flex items-center justify-center gap-x-2 font-black",
            className
        )}>
            <GiBestialFangs size={35} className="text-emerald-800" />
            <div className="flex items-center gap-x-0.5 text-neutral-900">
                <span className="">100</span>
                <span className="text-blue-600">x</span>
                <span className="">Menti</span>
            </div>
        </div>
    )
}