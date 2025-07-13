'use client';

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TimerBarProps {
  timer: number; // in milliseconds
  className?: string;
  bg?: string;
}

export default function TriangleTimerBar({ timer, className, bg = '#1e1e1e' }: TimerBarProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimate(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={cn("relative w-[600px] h-[100px]", className)}>
      <svg viewBox="0 0 1000 140" width="100%" height="100%">
        {/* Background Triangle */}
        <path
          d="M0 1.16702C0 0.553654 0.433192 0.0671652 1.03933 0.161072C18.4257 2.85467 250.06 38.7073 402.087 60.4916C633.537 93.6567 1000 140 1000 140H0.999987C0.447702 140 0 139.552 0 139V1.16702Z"
          fill={`${bg}33`}
        />

        {/* Clipped animated progress rectangle */}
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
            fill={bg}
            style={{
              width: animate ? '1000' : '0',
              transition: `width ${timer}ms linear`,
            }}
          />
        </g>
      </svg>

      {/* Points labels */}
      <div className="absolute -bottom-4 left-0 text-sm font-semibold">1000 pts</div>
      <div className="absolute -bottom-4 right-0 text-sm font-semibold">100 pts</div>
    </div>
  );
}
