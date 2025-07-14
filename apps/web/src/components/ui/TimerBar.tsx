'use client';

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TimerBarProps {
    timer: number;
    className?: string;
    bg?: string;
}

export default function TriangleTimerBar({ timer, className, bg = '#1e1e1e' }: TimerBarProps) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const start = Date.now();
        let animationFrame: number;

        const update = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min((elapsed / timer) * 1000, 1000); // max 1000
            setWidth(progress);
            if (elapsed < timer) {
                animationFrame = requestAnimationFrame(update);
            }
        };

        animationFrame = requestAnimationFrame(update);

        return () => cancelAnimationFrame(animationFrame);
    }, [timer]);

    return (
        <div className={cn("w-full h-[100px] flex items-center justify-center", className)}>
            <div className="w-[70%] relative">
                <svg viewBox="0 0 1000 140" width="100%" height="100%">
                    {/* Background Triangle */}
                    <path
                        d="M0 1.16702C0 0.553654 0.433192 0.0671652 1.03933 0.161072C18.4257 2.85467 250.06 38.7073 402.087 60.4916C633.537 93.6567 1000 140 1000 140H0.999987C0.447702 140 0 139.552 0 139V1.16702Z"
                        fill={`${bg}33`}
                    />

                    <clipPath id="triangle-clip">
                        <path
                            d="M0 1.16702C0 0.553654 0.433192 0.0671652 1.03933 0.161072C18.4257 2.85467 250.06 38.7073 402.087 60.4916C633.537 93.6567 1000 140 1000 140H0.999987C0.447702 140 0 139.552 0 139V1.16702Z"
                        />
                    </clipPath>

                    <g clipPath="url(#triangle-clip)">
                        <rect
                            x="0"
                            y="0"
                            height="140"
                            fill={`${bg}99`}
                            width={width}
                        />
                    </g>
                </svg>
                <div className="absolute -bottom-5 left-0 text-sm font-semibold">1000 pts</div>
                <div className="absolute -bottom-5 right-0 text-sm font-semibold">100 pts</div>
            </div>
        </div>
    );
}