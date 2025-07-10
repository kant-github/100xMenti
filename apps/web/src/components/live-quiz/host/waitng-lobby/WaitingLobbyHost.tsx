'use client';
import templates from '@/lib/templates';
import WaitingLobbyLeftCommon from '../../common/WaitingLobbyLeftCommon';
import WaitingLobbyRightHost from './WaitingLobbyRightHost';
import { useLiveQuizDataStore } from '@/zustand/liveQuizStore';

export default function WaitingLobbyHost() {

    const { liveQuiz } = useLiveQuizDataStore()
    const selectedTemplate = templates.find(t => t.id === liveQuiz.template);

    return (
        <div style={{ backgroundColor: selectedTemplate.accent}} className="min-h-screen">
            <div className='grid grid-cols-[70%_30%]'>
                <WaitingLobbyLeftCommon />
                <WaitingLobbyRightHost />
            </div>
        </div>
    );
};