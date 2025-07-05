'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BsFillHandThumbsUpFill } from "react-icons/bs";


export default function LiveQuizWaitingComponent() {
    const [users] = useState([
        { id: 1, name: "Alice", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-1.jpg" },
        { id: 2, name: "Bob", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-2.jpg" },
        { id: 3, name: "Charlie", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-3.jpg" },
        { id: 4, name: "Diana", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-4.jpg" },
        { id: 5, name: "Eve", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-5.jpg" },
        { id: 6, name: "Frank", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-6.jpg" },
        { id: 7, name: "Grace", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-7.jpg" },
        { id: 8, name: "Henry", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-8.jpg" },
        { id: 9, name: "Isabel", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-9.jpg" },
        { id: 10, name: "Jack", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-10.jpg" },
        { id: 11, name: "Alice", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-1.jpg" },
        { id: 12, name: "Bob", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-2.jpg" },
        { id: 13, name: "Charlie", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-3.jpg" },
        { id: 14, name: "Diana", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-4.jpg" },
        { id: 15, name: "Eve", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-5.jpg" },
        { id: 16, name: "Frank", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-6.jpg" },
        { id: 17, name: "Grace", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-7.jpg" },
        { id: 18, name: "Henry", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-8.jpg" },
        { id: 19, name: "Isabel", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-9.jpg" },
    ]);

    const avatarSize = 100;
    const minDistance = avatarSize + 25;
    const maxRadius = 200;

    const generatePositions = (total: number) => {
        const positions = [];

        if (total > 0) {
            positions.push({ x: 0, y: 0 });
        }

        const hexRadius = minDistance;
        let layer = 1;
        let avatarsPlaced = 1;

        while (avatarsPlaced < total && layer < 10) {
            const layerPositions = [];
            const positionsInLayer = 6 * layer;

            for (let i = 0; i < positionsInLayer; i++) {
                const angle = (i / positionsInLayer) * 2 * Math.PI;
                const radius = layer * hexRadius;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                layerPositions.push({ x, y });
            }

            for (const pos of layerPositions) {
                if (avatarsPlaced >= total) break;

                let validPosition = true;
                for (const existingPos of positions) {
                    const distance = Math.sqrt(
                        Math.pow(pos.x - existingPos.x, 2) +
                        Math.pow(pos.y - existingPos.y, 2)
                    );
                    if (distance < minDistance - 1) {
                        validPosition = false;
                        break;
                    }
                }

                if (validPosition) {
                    positions.push(pos);
                    avatarsPlaced++;
                }
            }

            layer++;
        }

        while (avatarsPlaced < total) {
            const gridSize = Math.ceil(Math.sqrt(total));
            const gridSpacing = minDistance;
            const index = avatarsPlaced - 1;
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;

            const offsetX = (gridSize - 1) * gridSpacing / 2;
            const offsetY = (gridSize - 1) * gridSpacing / 2;

            const x = col * gridSpacing - offsetX;
            const y = row * gridSpacing - offsetY;

            let validPosition = true;
            for (const existingPos of positions) {
                const distance = Math.sqrt(
                    Math.pow(x - existingPos.x, 2) +
                    Math.pow(y - existingPos.y, 2)
                );
                if (distance < minDistance - 1) {
                    validPosition = false;
                    break;
                }
            }

            if (validPosition) {
                positions.push({ x, y });
                avatarsPlaced++;
            } else {
                const offset = avatarsPlaced * 10;
                positions.push({ x: x + offset, y: y + offset });
                avatarsPlaced++;
            }
        }

        return positions;
    };

    const [positions] = useState(() => generatePositions(users.length));

    const Avatar = ({ user, index, total }) => {
        const position = positions[index];

        return (
            <motion.div
                className="absolute cursor-pointer"
                style={{
                    left: `calc(50% + ${position.x}px - 50px)`,
                    top: `calc(50% + ${position.y}px - 50px)`,
                    transform: 'translate(-50%, -50%)',
                    width: avatarSize,
                    height: avatarSize,
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
                    delay: index * 0.1,
                    duration: 0.6,
                    ease: "easeOut",
                    y: {
                        duration: 2.5 + Math.random() * 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
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
                            src={user.avatar}
                            alt={user.name}
                            fill
                            className="object-cover rounded-full"
                            sizes="110px"
                        />
                    </div>

                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white shadow-lg">
                        <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                    </div>

                    {/* Hover name tooltip */}
                    <div
                        className="absolute -top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none hidden group-hover:block"
                    >
                        <span className="text-gray-800 font-medium text-sm bg-white px-4 py-2 rounded-full shadow-xl border border-gray-200">
                            {user.name}
                        </span>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
            <div className="relative w-full max-w-5xl h-screen max-h-[900px]">

                {/* Central glowing background - adjusted for new layout */}
                <motion.div
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full "
                    style={{
                        width: maxRadius * 2.5,
                        height: maxRadius * 2.5,
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 50%, transparent 100%)',
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 360
                    }}
                    transition={{
                        duration: 1,
                        rotate: {
                            duration: 80,
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                />

                {/* Inner glow for center emphasis */}
                <motion.div
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/3 rounded-full "
                    style={{
                        width: minDistance * 2,
                        height: minDistance * 2,
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)',
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Avatars positioned from center outward */}
                {users.map((user, index) => (
                    <Avatar
                        key={user.id}
                        user={user}
                        index={index}
                        total={users.length}
                    />
                ))}


                {/* Bottom status bar */}
                <motion.div
                    className="absolute bottom-5 left-0 transform -translate-x-1/2 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <div className="bg-white/85 backdrop-blur-sm rounded-full px-8 py-4 shadow-xl border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {users.slice(0, 3).map((user) => (
                                    <div key={user.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            width={32}
                                            height={32}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ))}
                                {users.length > 3 && (
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                                        +{users.length - 3}
                                    </div>
                                )}
                            </div>
                            <span className="text-sm font-medium text-gray-700">Ready to begin</span>
                            <BsFillHandThumbsUpFill size={22} className="text-neutral-900 hover:text-[#ff0033] hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};