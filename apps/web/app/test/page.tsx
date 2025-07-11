'use client';

import { useEffect, useRef, useState } from "react";

interface HomeProps {
    timer: number; // in milliseconds
}

export default function Home({ timer = 20000 }: HomeProps) {
    const [width, setWidth] = useState(0);
    const requestRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);


    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;

            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min((elapsed / timer) * 100, 100); // percentage progress

            setWidth(progress);

            if (progress < 100) {
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(requestRef.current!);
    }, []);

    console.log(width);
    return (
        <div className="bg-neutral-100 h-screen w-full flex items-center justify-center">
            <svg width="600" height="100" viewBox="0 0 1000 140" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id="clip-shape">
                        <path
                            d="M0 1.16702C0 0.553654 0.433192 0.0671652 1.03933 0.161072C18.4257 2.85467 250.06 38.7073 402.087 60.4916C633.537 93.6567 1000 140 1000 140H0.999987C0.447702 140 0 139.552 0 139V1.16702Z"
                        />
                    </clipPath>
                </defs>

                {/* Red fill */}
                <path
                    d="M0 1.16702C0 0.553654 0.433192 0.0671652 1.03933 0.161072C18.4257 2.85467 250.06 38.7073 402.087 60.4916C633.537 93.6567 1000 140 1000 140H0.999987C0.447702 140 0 139.552 0 139V1.16702Z"
                    fill={`#393E46CA`}
                />

                {/* Animated Progress */}
                <foreignObject x="0" y="0" width="1000" height="140" clipPath="url(#clip-shape)">
                    <div
                        style={{ width: `${width}%`, height: '100%', backgroundColor: '#222831', transition: 'width 0.1s linear' }}
                    />
                </foreignObject>

                {/* Border */}
                <path
                    d="M0 1.16702C0 0.553654 0.433192 0.0671652 1.03933 0.161072C18.4257 2.85467 250.06 38.7073 402.087 60.4916C633.537 93.6567 1000 140 1000 140H0.999987C0.447702 140 0 139.552 0 139V1.16702Z"
                    fill="none"
                    strokeWidth={0}
                />
            </svg>
        </div>
    );
}
