import { useEffect } from "react"
import { useWebSocket } from "./useWebSocket"
import { MESSAGE_TYPES } from "@/types/ws-types"
import { useToast } from "./useToast"
import { useLiveSessionStore } from "@/zustand/liveSession"

export const useHostEventSubscriptions = () => {
    const { subscribeToHandler, unSubscribeToHandler } = useWebSocket()
    const { toast } = useToast();
    const { updateSession } = useLiveSessionStore()

    function handleIncomingJoinQuizHandler(newMessage: any) {
        const { sessionId, sessionCode, status } = newMessage;
        updateSession({
            id: sessionId,
            sessionCode,
            status
        })
    }

    function handleIncomingStartQuizHandler(newMessage: any) {
        const { hostScreen, status } = newMessage;
        console.log("new message is : ", newMessage);
        updateSession({
            hostScreen,
            status
        })
    }

    useEffect(() => {
        subscribeToHandler(MESSAGE_TYPES.QUIZ_CREATED, handleIncomingJoinQuizHandler);
        subscribeToHandler(MESSAGE_TYPES.QUESTION_PREVIEW, handleIncomingStartQuizHandler);
        return () => {
            unSubscribeToHandler(MESSAGE_TYPES.QUIZ_CREATED, handleIncomingJoinQuizHandler);
            unSubscribeToHandler(MESSAGE_TYPES.QUESTION_PREVIEW, handleIncomingStartQuizHandler);
        }
    }, [])
}