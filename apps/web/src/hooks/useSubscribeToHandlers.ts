import { useEffect } from "react";
import { useWebSocket } from "./useWebSocket"
import { MESSAGE_TYPES } from "@/types/ws-types";
import { useLiveQuizParticipantsStore } from "@/zustand/liveQuizParticipants";

export const useSubscribeToHandlers = () => {
    const { subscribeToHandler, unSubscribeToHandler } = useWebSocket();
    const { updateParticipant, addParticipant } = useLiveQuizParticipantsStore();

    function handleIncomingNameChangeHandler(newMessage: any) {
        const { participantId, participantName } = newMessage;
        updateParticipant(participantId, { name: participantName });
    }

    function handleIncomingParticipantJoinedHandler(newMessage: any) {
        console.log("new participant joined is : ", newMessage);
        const { participantId, avatar, name, liveSessionId } = newMessage;
        addParticipant({ participantId, avatar, name, liveSessionId });
    }

    useEffect(() => {
        subscribeToHandler(MESSAGE_TYPES.NAME_CHANGE, handleIncomingNameChangeHandler);
        subscribeToHandler(MESSAGE_TYPES.PARTICIPANT_JOINED, handleIncomingParticipantJoinedHandler);
        return () => {
            unSubscribeToHandler(MESSAGE_TYPES.NAME_CHANGE, handleIncomingNameChangeHandler);
            unSubscribeToHandler(MESSAGE_TYPES.PARTICIPANT_JOINED, handleIncomingParticipantJoinedHandler);
        }
    }, [])
}