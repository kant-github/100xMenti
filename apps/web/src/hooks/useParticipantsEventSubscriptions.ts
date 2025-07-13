import { useEffect } from "react"
import { useWebSocket } from "./useWebSocket"
import { MESSAGE_TYPES } from "@/types/ws-types"
import { useToast } from "./useToast"
import { useLiveSessionStore } from "@/zustand/liveSession"
import { ParticipantScreen } from "@/types/types"
import { useLiveQuestion } from "@/zustand/live-quiz-store/useLiveQuestion"


export const useParticipantsEventSubscriptions = () => {
    const { subscribeToHandler, unSubscribeToHandler } = useWebSocket()
    const { updateSession } = useLiveSessionStore()
    const { setQuestion, updateQuestion } = useLiveQuestion();

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

        const { phase, questionId, questionIdx, title, type, points, readingTimeLeft } = newMessage;
        updateSession({
            ...(phase === 'READING' && {
                participantScreen: ParticipantScreen.COUNTDOWN,
            }),
            currentQuestionIndex: questionIdx,
            currentQuestionId: questionId
        })
        setQuestion({
            id: questionId,
            title,
            type,
            points,
        });

    }

    function handleIncomingActiveQuestionWithOptionsHandler(newMessage: any) {
        const { phase, questionId, questionIdx, title, type, points, options, timeLimit, timeLeft } = newMessage;
        
        updateSession({
            ...(phase === 'ANSWERING' && {
                participantScreen: ParticipantScreen.QUESTION_ACTIVE
            }),
            currentQuestionId: questionId,
            currentQuestionIndex: questionIdx
        })

        updateQuestion({
            title,
            options,
            timing: timeLimit
        })
    }

    useEffect(() => {
        subscribeToHandler(MESSAGE_TYPES.JOINED_QUIZ, handleIncomingJoinQuizHandler);
        subscribeToHandler(MESSAGE_TYPES.QUESTION_MOTIVATION, handleIncomingMotivationHandler);
        subscribeToHandler(MESSAGE_TYPES.QUESTION_READING, handleIncomingQuestionReadingHandler);
        subscribeToHandler(MESSAGE_TYPES.QUESTION_ANSWERING, handleIncomingActiveQuestionWithOptionsHandler);
        return () => {
            unSubscribeToHandler(MESSAGE_TYPES.JOINED_QUIZ, handleIncomingJoinQuizHandler);
            unSubscribeToHandler(MESSAGE_TYPES.QUESTION_MOTIVATION, handleIncomingMotivationHandler);
            unSubscribeToHandler(MESSAGE_TYPES.QUESTION_READING, handleIncomingQuestionReadingHandler);
            unSubscribeToHandler(MESSAGE_TYPES.QUESTION_ANSWERING, handleIncomingActiveQuestionWithOptionsHandler);
        }
    }, [])
}