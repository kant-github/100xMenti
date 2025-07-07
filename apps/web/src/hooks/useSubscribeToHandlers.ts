import { useEffect } from "react";
import { useWebSocket } from "./useWebSocket"
import { MESSAGE_TYPES } from "@/types/ws-types";
import { useLiveQuizParticipantsStore } from "@/zustand/liveQuizParticipants";

export const useSubscribeToHandlers = () => {
    const { subscribeToHandler, unSubscribeToHandler } = useWebSocket();
    const { updateParticipant } = useLiveQuizParticipantsStore();
    function handleIncomingNameChangeHandler(newMessage: any) {
        console.log("name change messageis : ", newMessage);
        const { participantId, participantName } = newMessage;
        updateParticipant(participantId, { name: participantName });
    }

    useEffect(() => {
        subscribeToHandler(MESSAGE_TYPES.NAME_CHANGE, handleIncomingNameChangeHandler);
        return () => {
            unSubscribeToHandler(MESSAGE_TYPES.NAME_CHANGE, handleIncomingNameChangeHandler);
        }
    }, [])
}