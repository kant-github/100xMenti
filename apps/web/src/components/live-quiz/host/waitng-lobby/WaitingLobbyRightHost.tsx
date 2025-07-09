import { useState } from "react";
import WaitingLobbyDetailsHost from "../ui/WaitingLobbyDetailsHost";

enum WaitingLobbyRightHostRendererOption {
    DETAILS = 'DETAILS',
    QUESTIONS = 'QUESTIONS'
}

export default function WaitingLobbyRightHost() {
    const [displayState, setDisplayState] = useState<WaitingLobbyRightHostRendererOption>(WaitingLobbyRightHostRendererOption.DETAILS);

    function renderOption() {
        switch (displayState) {
            case WaitingLobbyRightHostRendererOption.DETAILS:
                return <WaitingLobbyDetailsHost />
            case WaitingLobbyRightHostRendererOption.QUESTIONS:
                return <div>sdhvjhsd</div>
        }
    }

    return (
        <div className='h-screen border-l-[1px] border-neutral-300 shadow-xl z-[60] rounded-l-xl transform transition-transform ease-in-out duration-300 overflow-hidden flex flex-col justify-between gap-y-6 bg-neutral-200 p-6 '>
            <div className="flex flex-col gap-y-2 flex-shrink-0">
                <div className="flex items-center justify-start gap-x-3">
                    <button onClick={() => setDisplayState(WaitingLobbyRightHostRendererOption.DETAILS)} type="button" className={`cursor-pointer text-xs text-neutral-700 font-light py-1 px-2 rounded-sm ${displayState === WaitingLobbyRightHostRendererOption.DETAILS && 'bg-neutral-300'} `}>details</button>
                    <button onClick={() => setDisplayState(WaitingLobbyRightHostRendererOption.QUESTIONS)} type="button" className={`cursor-pointer text-xs text-neutral-700 font-light py-1 px-2 rounded-sm ${displayState === WaitingLobbyRightHostRendererOption.QUESTIONS && 'bg-neutral-300'} `}>questions</button>
                </div>
                <hr className="border-neutral-500/50" />
            </div>
            <div className="flex-1">
                {renderOption()}
            </div>
        </div>
    );
}