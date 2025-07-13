'use client'
import { cn } from "@/lib/utils"
import Image from "next/image";

interface AppLogoProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function AppLogo({ className, style }: AppLogoProps) {
    return (
        <div 
            className={cn(
                "text-3xl flex items-center justify-center gap-x-2 font-medium",
                className
            )}
            style={style}
        >
            <Image
                src={"/app-logo.png"}
                width={36}
                height={36}
                alt="logo"
                unoptimized
            />
            <div className="flex items-center gap-x-0.5 tracking-wide mt-1">
                <span>Mentimeter</span>
            </div>
        </div>
    )
}