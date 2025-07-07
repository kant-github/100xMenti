'use client';
import React, { useEffect, useState } from 'react';

import { useLiveQuizDataStore } from '@/zustand/liveQuizStore';
import { Clock3, Info, User2 } from 'lucide-react';
import { useLiveSessionStore } from '@/zustand/liveSession';
import { Input } from '@/components/ui/input';
import { useliveQuizMeParticipantStore } from '@/zustand/liveQuizMeParticipant';
import Image from 'next/image';
import { useWebSocket } from '@/hooks/useWebSocket';
import WaitingLobbyAvatar, { Position, User } from '../../participant/waiting-lobby/WaitingLobbyAvatar';
import WaitingLobbyBottomTicker from '../../participant/waiting-lobby/WaitingLobbyBottomTicker';

export default function WaitingLobbyHost() {

    const { sendJoinQuizMessage } = useWebSocket();
    const { liveSession } = useLiveSessionStore()

    useEffect(() => {
        if (liveSession.id && liveSession.quizId) {
            const data = {
                quizId: liveSession.quizId,
                sessionId: liveSession.id
            }
            console.log("data sending to join the quiz is : ", data);
            sendJoinQuizMessage(data);
        }
    }, [liveSession.id, liveSession.quizId])

    const { liveQuiz } = useLiveQuizDataStore()
    const { participant } = useliveQuizMeParticipantStore()
    const [users] = useState<User[]>([
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
        { id: 20, name: "Jack", avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-10.jpg" },
    ]);

    const avatarSize = 100;
    const minDistance = avatarSize + 20;

    const generatePositions = (total: number): Position[] => {
        const positions: Position[] = [];

        if (total > 0) {
            positions.push({ x: 0, y: 0 });
        }

        const hexRadius = minDistance;
        let layer = 1;
        let avatarsPlaced = 1;

        while (avatarsPlaced < total && layer < 10) {
            const layerPositions: Position[] = [];
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

    const [positions] = useState<Position[]>(() => generatePositions(users.length));

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-purple-50 ">
            <div className='grid grid-cols-[70%_30%]'>
                {/* Left Panel */}
                <div className="w-full max-w-5xl h-screen max-h-[900px] flex items-center justify-center relative">
                    {users.map((user, index) => (
                        <WaitingLobbyAvatar
                            key={user.id}
                            user={user}
                            position={positions[index]}
                            index={index}
                            size={avatarSize}
                            showOnlineIndicator={true}
                            showNameTooltip={true}
                        />
                    ))}
                    <WaitingLobbyBottomTicker users={users} />
                </div>

                {/* Right Panel */}
                <div className='h-screen border-l-[1px] border-zinc-300 shadow-xl z-[60] rounded-l-xl transform transition-transform ease-in-out duration-300 overflow-hidden flex flex-col justify-between bg-neutral-200'>
                    <div className='p-6 flex flex-col space-y-4'>
                        <h2 className='text-lg font-bold text-zinc-800 mb-2'># Quiz Details</h2>

                        <div className='space-y-3'>
                            <h3 className='font-mono text-base font-medium text-zinc-900 leading-relaxed tracking-wide'>
                                {liveQuiz.title}
                            </h3>

                            <p className='text-sm text-zinc-700 leading-relaxed'>
                                {liveQuiz.description}
                            </p>
                        </div>

                        <div className='flex justify-between items-center pt-2'>
                            <div className='flex items-center gap-x-2'>
                                <Clock3 size={16} className='text-zinc-600' />
                                <span className='font-semibold text-zinc-600 text-sm'>{liveQuiz.defaultTimeLimit}s</span>
                                <span className='text-sm text-zinc-600'>per question</span>
                            </div>

                            <div className='flex items-center gap-x-2'>
                                <User2 size={16} className='text-zinc-600' />
                                <span className='text-sm text-zinc-600'>{liveSession.participants.length} participants</span>
                            </div>
                        </div>


                        <div className="flex items-center justify-between gap-x-3 bg-neutral-100  px-4 py-2 rounded-xl shadow-sm">
                            <div className='flex items-center gap-x-3'>
                                <Image
                                    src={liveQuiz.creator.image || "/placeholder-avatar.png"}
                                    width={32}
                                    height={32}
                                    alt={`${liveQuiz.creator.name || "Quiz Creator"}'s avatar`}
                                    className="rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-neutral-900 ">
                                        {liveQuiz.creator.name || "Unknown"}
                                    </span>
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {liveQuiz.creator.email}
                                    </span>
                                </div>
                            </div>
                            <span className='text-sm font-medium text-neutral-500 select-none'>host</span>
                        </div>

                    </div>

                    <div className='px-6 mb-4 flex flex-col space-y-4'>

                        <div className='bg-neutral-800 rounded-xl border border-neutral-300 p-4 shadow-lg'>
                            <label className='block text-sm font-medium text-neutral-100 mb-2'>
                                Choose your display name
                            </label>
                            <p className='text-xs text-neutral-300 mb-3'>
                                This name will be visible to other participants
                            </p>
                            <Input
                                type="text"
                                placeholder="Choose your name"
                                className="w-full mt-8 px-5 py-5 text-base rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-0 focus:shadow-none focus:border-neutral-300 outline-none ring-0"
                                value={participant.name}
                            />
                        </div>
                        <div className='p-4 bg-neutral-300 rounded-xl border border-neutral-300'>
                            <div className='flex items-start gap-x-3'>
                                <Info size={16} className='text-neutral-600 mt-0.5' />
                                <div>
                                    <h4 className='text-sm font-medium text-neutral-900 mb-1'>Before you join</h4>
                                    <ul className='text-xs text-neutral-700 space-y-1'>
                                        <li>• Make sure you have a stable internet connection</li>
                                        <li>• Keep this tab active during the quiz</li>
                                        <li>• Your answers will be submitted automatically</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};