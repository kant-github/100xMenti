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

            case 'staircase':
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

            default:
                return null;
        }
    };

    return getDesignElement();
}