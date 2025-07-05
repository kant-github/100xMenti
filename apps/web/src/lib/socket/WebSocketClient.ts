export default class WebSocketClient {
    private ws: WebSocket;
    private URL: string;
    private isConnected: boolean;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;

    constructor(URL: string) {
        this.URL = URL
        this.connect();
    }

    private async connect() {
        this.ws = new WebSocket(this.URL);

        this.ws.onopen = () => {
            this.isConnected = true;
            this.reconnectAttempts = 0
        }

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleIncomingMessage(message);
            } catch (err) {
                console.error("Error in parsing the incoming message", err);
            }
        }
    }

    private handleIncomingMessage(message: any) {
        const { type, data } = message;
        
    }
}