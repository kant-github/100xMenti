'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import { useLiveQuizDataStore } from '@/zustand/liveQuizStore';
import { ChevronRight, Info } from 'lucide-react';
import { useLiveSessionStore } from '@/zustand/liveSession';
import { Input } from '@/components/ui/input';
import { useliveQuizMeParticipantStore } from '@/zustand/liveQuizMeParticipant';
import Image from 'next/image';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { ParticipantType } from '@/types/types';
import WaitingLobbyLeftCommon from '../../common/WaitingLobbyLeftCommon';

export default function WaitingLobbyParticipant() {
    const { sendJoinQuizMessage, sendNameChangeMessage } = useWebSocket();
    const { liveSession } = useLiveSessionStore()
    const { liveQuiz } = useLiveQuizDataStore()
    const { toast } = useToast();
    const { participant, setParticipant } = useliveQuizMeParticipantStore()
    const [participantName, setParticipantName] = useState<string>(participant?.name);

    useEffect(() => {
        if (liveSession.id && liveSession.quizId) {
            const data = {
                quizId: liveSession.quizId,
                sessionId: liveSession.id
            }
            sendJoinQuizMessage(data);
        }
    }, [liveSession.id, liveSession.quizId])

    function changeName(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (participantName.length < 3) {
            toast({
                title: "Your name should contain atleast 3 characters"
            })
            return;
        }
        const updatedParticipant: ParticipantType = { ...participant, name: participantName, isNameChanged: true };
        setParticipant(updatedParticipant);
        const payload = {
            participantId: participant.id,
            participantName: participantName
        }
        sendNameChangeMessage(payload);
    }

    return (
        <div className="min-h-screen">
            <div className='grid grid-cols-[70%_30%]'>
                <WaitingLobbyLeftCommon />
                <div className='h-screen border-l-[1px] border-neutral-300 shadow-xl z-[60] rounded-l-xl transform transition-transform ease-in-out duration-300 overflow-hidden flex flex-col justify-between bg-neutral-200 p-6 '>
                    <div className='flex flex-col space-y-4'>
                        <h2 className='text-lg font-bold text-zinc-800 mb-2'># Quiz Details</h2>

                        <div className='space-y-3'>
                            <h3 className='font-mono text-base font-medium text-zinc-900 leading-relaxed tracking-wide'>
                                {liveQuiz.title}
                            </h3>

                            <p className='text-sm text-zinc-700 leading-relaxed'>
                                {liveQuiz.description}
                            </p>
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
                    <div className='w-full flex flex-col gap-y-8 items-center justify-center'>
                        {participant?.avatar && (
                            <Image
                                alt='user'
                                src={participant.avatar}
                                width={200}
                                height={100}
                                priority
                                unoptimized={true}
                                className='rounded-full'
                            />
                        )}
                        {
                            participant.isNameChanged && (
                                <div className='flex flex-col gap-y-4 items-center justify-center'>
                                    <div className='text-neutral-900 font- text-[29px]'>
                                        Get ready to play {participant.name.split(" ")[0].toLowerCase()}!
                                    </div>
                                    <div className='text-sm font-normal text-neutral-500'>
                                        Answer fast to get more points!
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    {!participant.isNameChanged && (
                        <div className='mb-4 flex flex-col space-y-4'>
                            <div className='bg-neutral-800 rounded-xl border border-neutral-300 p-4 shadow-lg'>
                                <label className='block text-sm font-medium text-neutral-300 mb-2'>
                                    Choose your display name
                                </label>
                                <p className='text-xs text-neutral-400 mb-3'>
                                    This name will be visible to other participants
                                </p>
                                <form onSubmit={changeName} className="relative mt-8">
                                    <Input
                                        type="text"
                                        placeholder="Choose your name"
                                        className="w-full px-5 py-5 text-base rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-300"
                                        value={participantName}
                                        onChange={(e) => setParticipantName(e.target.value)}
                                    />

                                    <Button
                                        type="submit"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-900 text-white rounded-full p-0 flex items-center justify-center shadow-md"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}

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
    );
};