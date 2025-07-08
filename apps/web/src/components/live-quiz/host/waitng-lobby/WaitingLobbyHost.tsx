'use client';
import WaitingLobbyLeftCommon from '../../common/WaitingLobbyLeftCommon';

export default function WaitingLobbyHost() {
    return (
        <div className="min-h-screen bg-neutral-100">
            <div className='grid grid-cols-[70%_30%]'>
                <WaitingLobbyLeftCommon />
                <div className='h-screen border-l-[1px] border-neutral-300 shadow-xl z-[60] rounded-l-xl transform transition-transform ease-in-out duration-300 overflow-hidden flex flex-col justify-between bg-neutral-200 p-6 '>
                    hey
                </div>
            </div>
        </div>
    );
};