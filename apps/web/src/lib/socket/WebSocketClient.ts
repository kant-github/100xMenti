import { MESSAGE_TYPES } from "@/types/ws-types";

export default class WebSocketClient {
    private ws: WebSocket;
    private URL: string;
    private isConnected: boolean;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private eventListeners: Map<string, Function[]> = new Map();
    private messageQueue: any[] = [];

    constructor(URL: string) {
        this.URL = URL
        this.connect();
    }

    private async connect() {
        this.ws = new WebSocket(this.URL);

        this.ws.onopen = () => {
            this.isConnected = true;
            this.reconnectAttempts = 0
            console.log('WebSocket connected');
            this.flushMessageQueue()
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

        switch (type) {
            case MESSAGE_TYPES.QUIZ_CREATED:
                this.emit('quizCreated', data);
                break;
            case MESSAGE_TYPES.JOINED_QUIZ:
                this.emit('joinedQuiz', data);
                break;
            case MESSAGE_TYPES.PARTICIPANT_JOINED:
                this.emit('participantJoined', data);
                break;
            case MESSAGE_TYPES.PARTICIPANT_LEFT:
                this.emit('participantLeft', data);
                break;
            case MESSAGE_TYPES.QUESTION_STARTED:
                this.emit('questionStarted', data);
                break;
            case MESSAGE_TYPES.QUIZ_ENDED:
                this.emit('quizEnded', data);
                break;
            case MESSAGE_TYPES.ANSWER_SUBMITTED:
                this.emit('answerSubmitted', data);
                break;
            case MESSAGE_TYPES.LEADERBOARD_UPDATE:
                this.emit('leaderboardUpdate', data);
                break;
            case MESSAGE_TYPES.ERROR:
                this.emit('error', data);
                break;
            default:
                console.warn('Unknown message type:', type);
                this.emit('unknownMessage', { type, data });
        }

    }

    public joinQuiz() {
        
    }

    private emit(event: string, payload: any) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach((handler) => {
                try {
                    handler(payload);
                } catch (err) {
                    console.error(`Error in event listener for ${event}:`, err);

                }
            })
        }
    }

    public on(event: string, handler: Function) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(handler);
    }

    public off(event: string, handler?: Function) {
        if (!this.eventListeners.has(event)) return;

        if (handler) {
            const handlers = this.eventListeners.get(event);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
            this.eventListeners.set(event, handlers);

        } else {
            this.eventListeners.delete(event);
        }
    }

    public sendMessage(message: any): void {
        if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            this.messageQueue.push(message);
        }
    }

    private flushMessageQueue(): void {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.sendMessage(message);
        }
    }
}