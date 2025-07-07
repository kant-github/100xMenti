import { getWebSocketClient } from "@/lib/socket/singleton-ws";
import WebSocketClient from "@/lib/socket/WebSocketClient";
import { MESSAGE_TYPES } from "@/types/ws-types";
import { useMemo, useRef, useState } from "react";

export const useWebSocket = () => {
    const webSocketRef = useRef<WebSocketClient | null>(null);
    const [quizToken] = useState<string>(() => {
        const participantToken = sessionStorage.getItem('quiz_token');
        const hostToken = sessionStorage.getItem('host_token');
        return participantToken || hostToken || '';
    });

    useMemo(() => {
        if (quizToken) {
            const ws = getWebSocketClient(`ws://localhost:8080?token=${quizToken}`);
            webSocketRef.current = ws;
        }
    }, [quizToken]);

    function subscribeToHandler(event: string, handler: (payload: any) => void) {
        if (!webSocketRef.current) return () => { };
        return webSocketRef.current.on(event, handler);
    }

    function unSubscribeToHandler(event: string, handler: (payload: any) => void) {
        return webSocketRef.current.off(event, handler);
    }

    function sendMessage(message: any) {
        if (!webSocketRef.current) return;
        webSocketRef.current.sendMessage(message);
    }

    function sendJoinQuizMessage(data: any) {
        if (!data || !webSocketRef.current) {
            return
        };

        const message = {
            type: MESSAGE_TYPES.JOIN_QUIZ,
            payload: data
        }
        webSocketRef.current.sendMessage(message);
    }

    function sendLike(data: any) {
        const message = {
            type: MESSAGE_TYPES.LIKE,
            payload: data
        }
        webSocketRef.current.sendMessage(message);
    }

    function sendNameChangeMessage(data: any) {
        const message = {
            type: MESSAGE_TYPES.NAME_CHANGE,
            payload: data
        }
        webSocketRef.current.sendMessage(message);
    }

    return {
        subscribeToHandler,
        unSubscribeToHandler,
        sendMessage,
        sendJoinQuizMessage,
        sendLike,
        sendNameChangeMessage
    }
}