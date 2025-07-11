'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';


interface User {
    id: number;
    name: string;
    avatar: string;
}

interface Position {
    x: number;
    y: number;
}

interface AvatarProps {
    avatar: string;
    name: string;
    size?: number;
    showOnlineIndicator?: boolean;
    showNameTooltip?: boolean;
    className?: string;
}

export default function Avatar({
    avatar,
    name,
    size = 100,
    showOnlineIndicator = true,
    showNameTooltip = true,
    className = '',
}: AvatarProps) {
    return (
        <motion.div
            className={`cursor-pointer ${className}`}
            style={{
                transform: 'translate(-50%, -50%)',
                width: size,
                height: size,
            }}
            initial={{
                opacity: 0,
                scale: 0,
                y: 30
            }}
            animate={{
                opacity: 1,
                scale: 1,
                y: [0, -6, 0], // Gentle floating
            }}
            transition={{
                duration: 0.6,
                ease: "easeOut",
                y: {
                    duration: 2.5 + Math.random() * 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                }
            }}
            whileHover={{
                scale: 1.2,
                zIndex: 10,
                transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            whileTap={{
                scale: 0.95,
                transition: { duration: 0.1 }
            }}
        >
            <div className="relative w-full h-full group">
                {/* Avatar with enhanced styling */}
                <div className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white bg-white ring-4 ring-blue-100/60 hover:ring-blue-200/80 transition-all duration-300">
                    <Image
                        src={avatar}
                        alt={name}
                        fill
                        priority
                        className="object-cover rounded-full"
                        sizes={`${size + 10}px`}
                    />
                </div>

                {/* Online indicator */}
                {showOnlineIndicator && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white shadow-lg">
                        <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                )}

                {/* Hover name tooltip */}
                {showNameTooltip && (
                    <div
                        className="absolute -top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none hidden group-hover:block"
                    >
                        <span className="text-gray-800 font-medium text-sm bg-white px-4 py-2 rounded-full shadow-xl border border-gray-200">
                            {name}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export type { User, Position, AvatarProps };