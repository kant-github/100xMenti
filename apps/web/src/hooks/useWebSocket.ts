import { getWebSocketClient } from "@/lib/socket/singleton-ws";
import WebSocketClient from "@/lib/socket/WebSocketClient";
import { useMemo, useRef } from "react";

export const useWebSocket = () => {
    const webSocketRef = useRef<WebSocketClient | null>(null);

    useMemo(() => {
        const ws = getWebSocketClient('ws://localhost:8080');
        webSocketRef.current = ws
    }, [])

    function subscribeToHandler(event: string, handler: (payload: any) => void) {
        if (!webSocketRef.current) return () => { };
        return webSocketRef.current.on(event, handler);
    }

    function unsubscribeToHandler(event: string, handler: (payload: any) => void) {
        return webSocketRef.current.off(event, handler);
    }

    function sendMessage(message: any) {
        if (!webSocketRef.current) return;

        webSocketRef.current.sendMessage(message);
    }

    return {
        subscribeToHandler,
        unsubscribeToHandler,
        sendMessage
    }
}