
import WebSocketClient from "./WebSocketClient";

let wsClient: WebSocketClient | null = null;
let isConnecting = false;

export function getWebSocketClient(URL: string) {
    if (!wsClient && !isConnecting) {
        isConnecting = true;
        wsClient = new WebSocketClient(URL);
        isConnecting = false;
    }
    return wsClient;
}