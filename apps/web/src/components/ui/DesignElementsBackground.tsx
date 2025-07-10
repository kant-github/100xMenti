// DesignBackground.tsx
import React from 'react';

interface DesignBackgroundProps {
    design: string;
    accentColor: string;
}

export default function DesignBackground({ design, accentColor }: DesignBackgroundProps) {
    const getDesignElement = () => {
        switch (design) {
            case 'circle':
                return (
                    <div
                        className="absolute inset-0 overflow-hidden rounded-xl"
                        style={{ zIndex: 0 }}
                    >
                        <div
                            className="absolute -top-1/2 -right-1/2 w-[150%] h-[150%] rounded-full"
                            style={{
                                backgroundColor: accentColor,
                                opacity: 0.1,
                            }}
                        />
                    </div>
                );

            case 'wave':
                return (
                    <div
                        className="absolute inset-0 overflow-hidden rounded-xl"
                        style={{ zIndex: 0 }}
                    >
                        {/* Multiple staircase steps */}
                        <div
                            className="absolute -top-1/2 -right-1/2 w-[150%] h-[150%] aspect-square rotate-45"
                            style={{
                                backgroundColor: accentColor,
                                opacity: 0.1,
                            }}
                        />
                    </div>
                );

            case 'staircase':
                return (
                    <div
                        className="absolute inset-0 overflow-hidden rounded-xl"
                        style={{ zIndex: 0 }}
                    >
                        {/* SVG Staircase */}
                        <svg
                            className="absolute -bottom-1/8 -right-1/4 w-[120%] h-[120%]"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M 0 100 L 0 80 L 20 80 L 20 60 L 40 60 L 40 40 L 60 40 L 60 20 L 80 20 L 80 0 L 100 0 L 100 100 Z"
                                fill={accentColor}
                                opacity="0.08"
                            />
                        </svg>
                    </div>
                );

            default:
                return null;
        }
    };

    return getDesignElement();
}