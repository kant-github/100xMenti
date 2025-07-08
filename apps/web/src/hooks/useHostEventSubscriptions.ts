import { useEffect } from "react"
import { useWebSocket } from "./useWebSocket"
import { MESSAGE_TYPES } from "@/types/ws-types"
import { useToast } from "./useToast"

export const useHostEventSubscriptions = () => {
    const { subscribeToHandler, unSubscribeToHandler } = useWebSocket()
    const { toast } = useToast();

    function handleIncomingJoinQuizHandler(newMessage: any) {
        toast({
            title: "Quiz is live now",
            description: 'Share the session code to ask users to join'
        })
    }

    useEffect(() => {
        subscribeToHandler(MESSAGE_TYPES.QUIZ_CREATED, handleIncomingJoinQuizHandler);
        return () => {
            unSubscribeToHandler(MESSAGE_TYPES.QUIZ_CREATED, handleIncomingJoinQuizHandler);
        }
    }, [])
}