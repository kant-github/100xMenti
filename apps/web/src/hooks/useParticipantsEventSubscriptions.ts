import { useEffect } from "react"
import { useWebSocket } from "./useWebSocket"
import { MESSAGE_TYPES } from "@/types/ws-types"
import { useToast } from "./useToast"
import { useLiveSessionStore } from "@/zustand/liveSession"
import { ParticipantScreen } from "@/types/types"


export const useParticipantsEventSubscriptions = () => {
    const { subscribeToHandler, unSubscribeToHandler } = useWebSocket()
    const { updateSession } = useLiveSessionStore()
    const { toast } = useToast();

    function handleIncomingJoinQuizHandler(newMessage: any) {
        toast({
            title: "Quiz is live now",
            description: 'Share the session code to ask users to join'
        })
    }

    function handleIncomingMotivationHandler(newMessage: any) {
        const { phase, participantScreen, message } = newMessage;
        updateSession({
            ...(phase === 'MOTIVATION' && {
                participantScreen: ParticipantScreen.MOTIVATION,
            })
        })
    }

    function handleIncomingQuestionReadingHandler(newMessage: any) {
        const { phase, questionId, title, type, points, readingTimeLeft } = newMessage;
        updateSession({
            ...(phase === 'QUESTION_READING' && {
                participantScreen: ParticipantScreen.COUNTDOWN
            })
        })
    }

    useEffect(() => {
        subscribeToHandler(MESSAGE_TYPES.JOINED_QUIZ, handleIncomingJoinQuizHandler);
        subscribeToHandler(MESSAGE_TYPES.QUESTION_MOTIVATION, handleIncomingMotivationHandler);
        subscribeToHandler(MESSAGE_TYPES.QUESTION_READING, handleIncomingQuestionReadingHandler);
        return () => {
            unSubscribeToHandler(MESSAGE_TYPES.JOINED_QUIZ, handleIncomingJoinQuizHandler);
            unSubscribeToHandler(MESSAGE_TYPES.QUESTION_MOTIVATION, handleIncomingMotivationHandler);
            unSubscribeToHandler(MESSAGE_TYPES.QUESTION_READING, handleIncomingQuestionReadingHandler);
        }
    }, [])
}