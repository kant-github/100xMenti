'use client';
import WaitingLobbyLeftCommon from '../../common/WaitingLobbyLeftCommon';
import WaitingLobbyRightHost from './WaitingLobbyRightHost';

export default function WaitingLobbyHost() {
    return (
        <div className="min-h-screen bg-neutral-100">
            <div className='grid grid-cols-[70%_30%]'>
                <WaitingLobbyLeftCommon />
                <WaitingLobbyRightHost />
            </div>
        </div>
    );
};