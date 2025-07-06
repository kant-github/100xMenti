import WebSocketClient from "./WebSocketClient";

let wsClient: WebSocketClient | null;


export function getWebSocketClient(URL: string) {
    if (!wsClient) {
        wsClient = new WebSocketClient(URL);
    }
    return wsClient;
}