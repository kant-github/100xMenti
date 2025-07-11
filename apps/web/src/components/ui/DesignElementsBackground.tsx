// DesignBackground.tsx
import React from 'react';

interface DesignBackgroundProps {
    design: string;
    accentColor: string;
}

export default function DesignElementsBackground({ design, accentColor }: DesignBackgroundProps) {
    const getDesignElement = () => {
        switch (design) {
            case 'circle':
                return (
                    <div
                        className="absolute inset-0 overflow-hidden rounded-xl"
                        style={{ zIndex: 0 }}
                    >
                        <svg
                            className="absolute -top-1/2 -right-1/2 w-[150%] h-[150%]"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill={accentColor}
                                opacity="0.1"
                            />
                        </svg>
                    </div>
                );

            case 'slash':
                return (
                    <div
                        className="absolute inset-0 overflow-hidden rounded-xl"
                        style={{ zIndex: 0 }}
                    >
                        <svg
                            className="absolute -top-1/2 -right-1/2 w-[150%] h-[150%]"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M 0 100 L 100 0 L 100 100 Z"
                                fill={accentColor}
                                opacity="0.1"
                            />
                        </svg>
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
            case 'donut':
                return (
                    <div
                        className="absolute inset-0 overflow-hidden rounded-xl"
                        style={{ zIndex: 0 }}
                    >
                        <svg
                            className="absolute -top-1/2 -right-1/2 w-[150%] h-[150%]"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <defs>
                                <mask id="donut-mask">
                                    <rect width="100" height="100" fill="white" />
                                    <circle cx="50" cy="50" r="15" fill="black" />
                                </mask>
                            </defs>
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill={accentColor}
                                opacity="0.1"
                                mask="url(#donut-mask)"
                            />
                        </svg>
                    </div>
                );
            case 'wave':
                return (
                    <div
                        className="absolute inset-0 overflow-hidden rounded-xl"
                        style={{ zIndex: 0 }}
                    >
                        <svg
                            className="absolute bottom-0 left-0 w-full h-full"
                            viewBox="0 0 400 200"
                            preserveAspectRatio="none"
                        >
                            {/* Main wave with perfectly looping motion */}
                            <path
                                fill={accentColor}
                                opacity="0.12"
                                d="M 0 120 Q 50 80 100 120 T 200 120 T 300 120 T 400 120 V 200 H 0 Z"
                            >
                                <animate
                                    attributeName="d"
                                    values="M 0 120 Q 50 80 100 120 T 200 120 T 300 120 T 400 120 V 200 H 0 Z;
                                           M 0 118 Q 50 85 100 115 T 200 125 T 300 115 T 400 118 V 200 H 0 Z;
                                           M 0 115 Q 50 90 100 110 T 200 130 T 300 110 T 400 115 V 200 H 0 Z;
                                           M 0 118 Q 50 85 100 115 T 200 125 T 300 115 T 400 118 V 200 H 0 Z;
                                           M 0 120 Q 50 80 100 120 T 200 120 T 300 120 T 400 120 V 200 H 0 Z;
                                           M 0 122 Q 50 75 100 125 T 200 115 T 300 125 T 400 122 V 200 H 0 Z;
                                           M 0 125 Q 50 70 100 130 T 200 110 T 300 130 T 400 125 V 200 H 0 Z;
                                           M 0 122 Q 50 75 100 125 T 200 115 T 300 125 T 400 122 V 200 H 0 Z;
                                           M 0 120 Q 50 80 100 120 T 200 120 T 300 120 T 400 120 V 200 H 0 Z"
                                    dur="8s"
                                    repeatCount="indefinite"
                                    calcMode="spline"
                                    keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
                                    keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                                />
                            </path>

                            {/* Secondary wave with seamless loop */}
                            <path
                                fill={accentColor}
                                opacity="0.08"
                                d="M 0 140 Q 75 100 150 140 T 300 140 T 450 140 V 200 H 0 Z"
                            >
                                <animate
                                    attributeName="d"
                                    values="M 0 140 Q 75 100 150 140 T 300 140 T 450 140 V 200 H 0 Z;
                                           M 0 143 Q 75 95 150 145 T 300 135 T 450 143 V 200 H 0 Z;
                                           M 0 145 Q 75 90 150 150 T 300 130 T 450 145 V 200 H 0 Z;
                                           M 0 143 Q 75 95 150 145 T 300 135 T 450 143 V 200 H 0 Z;
                                           M 0 140 Q 75 100 150 140 T 300 140 T 450 140 V 200 H 0 Z;
                                           M 0 137 Q 75 105 150 135 T 300 145 T 450 137 V 200 H 0 Z;
                                           M 0 135 Q 75 110 150 130 T 300 150 T 450 135 V 200 H 0 Z;
                                           M 0 137 Q 75 105 150 135 T 300 145 T 450 137 V 200 H 0 Z;
                                           M 0 140 Q 75 100 150 140 T 300 140 T 450 140 V 200 H 0 Z"
                                    dur="10s"
                                    repeatCount="indefinite"
                                    calcMode="spline"
                                    keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
                                    keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                                />
                            </path>

                            {/* Third wave with perfect continuity */}
                            <path
                                fill={accentColor}
                                opacity="0.06"
                                d="M 0 160 Q 25 130 50 160 T 100 160 T 150 160 T 200 160 V 200 H 0 Z"
                            >
                                <animate
                                    attributeName="d"
                                    values="M 0 160 Q 25 130 50 160 T 100 160 T 150 160 T 200 160 V 200 H 0 Z;
                                           M 0 158 Q 25 135 50 155 T 100 165 T 150 155 T 200 158 V 200 H 0 Z;
                                           M 0 155 Q 25 140 50 150 T 100 170 T 150 150 T 200 155 V 200 H 0 Z;
                                           M 0 158 Q 25 135 50 155 T 100 165 T 150 155 T 200 158 V 200 H 0 Z;
                                           M 0 160 Q 25 130 50 160 T 100 160 T 150 160 T 200 160 V 200 H 0 Z;
                                           M 0 162 Q 25 125 50 165 T 100 155 T 150 165 T 200 162 V 200 H 0 Z;
                                           M 0 165 Q 25 120 50 170 T 100 150 T 150 170 T 200 165 V 200 H 0 Z;
                                           M 0 162 Q 25 125 50 165 T 100 155 T 150 165 T 200 162 V 200 H 0 Z;
                                           M 0 160 Q 25 130 50 160 T 100 160 T 150 160 T 200 160 V 200 H 0 Z"
                                    dur="12s"
                                    repeatCount="indefinite"
                                    calcMode="spline"
                                    keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
                                    keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                                />
                            </path>
                        </svg>
                    </div>
                );

            default:
                return null;
        }
    };

    return getDesignElement();
}