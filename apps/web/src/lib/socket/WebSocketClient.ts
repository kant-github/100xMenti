import { MESSAGE_TYPES } from "@/types/ws-types";

export default class WebSocketClient {
    private ws: WebSocket;
    private URL: string;
    private isConnected: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private eventListeners: Map<string, Function[]> = new Map();
    private messageQueue: any[] = [];
    private reconnectDelay: number = 1000;

    constructor(URL: string) {
        this.URL = URL
        this.connect();
    }

    private async connect() {
        this.ws = new WebSocket(this.URL);

        this.ws.onopen = () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.reconnectDelay = 1000;
            this.flushMessageQueue();
            this.emit('connected', null);
        }

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleIncomingMessage(message);
            } catch (err) {
                console.error("Error in parsing the incoming message", err);
            }
        }

        this.ws.onclose = (event) => {
            this.isConnected = false;

            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
                this.reconnectTimeout = null;
            }

            this.emit('disconnected', { code: event.code, reason: event.reason });

            if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.attemptReconnect();
            } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
                this.emit('maxReconnectAttemptsReached', null);
            }
        }

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.emit('error', error);
        }
    }

    private attemptReconnect() {
        this.reconnectAttempts++;

        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, this.reconnectDelay);

        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);

        this.emit('reconnecting', { attempt: this.reconnectAttempts });
    }

    private handleIncomingMessage(message: any) {
        const { type, payload } = message;
        switch (type) {
            case MESSAGE_TYPES.QUIZ_CREATED:
                this.emit(MESSAGE_TYPES.QUIZ_CREATED, payload);
                break;
            case MESSAGE_TYPES.JOINED_QUIZ:
                this.emit(MESSAGE_TYPES.JOINED_QUIZ, payload);
                break;
            case MESSAGE_TYPES.PARTICIPANT_JOINED:
                this.emit(MESSAGE_TYPES.PARTICIPANT_JOINED, payload);
                break;
            case MESSAGE_TYPES.PARTICIPANT_LEFT:
                this.emit(MESSAGE_TYPES.PARTICIPANT_LEFT, payload);
                break;
            case MESSAGE_TYPES.QUESTION_STARTED:
                this.emit(MESSAGE_TYPES.QUESTION_STARTED, payload);
                break;
            case MESSAGE_TYPES.QUIZ_ENDED:
                this.emit(MESSAGE_TYPES.QUIZ_ENDED, payload);
                break;
            case MESSAGE_TYPES.ANSWER_SUBMITTED:
                this.emit(MESSAGE_TYPES.ANSWER_SUBMITTED, payload);
                break;
            case MESSAGE_TYPES.LEADERBOARD_UPDATE:
                this.emit(MESSAGE_TYPES.LEADERBOARD_UPDATE, payload);
                break;
            case MESSAGE_TYPES.ERROR:
                this.emit(MESSAGE_TYPES.ERROR, payload);
                break;
            case MESSAGE_TYPES.LIKE:
                this.emit(MESSAGE_TYPES.LIKE, payload);
                break;
            case MESSAGE_TYPES.NAME_CHANGE:
                this.emit(MESSAGE_TYPES.NAME_CHANGE, payload);
                break;
            default:
                console.warn('Unknown message type:', type);
                this.emit('unknownMessage', { type, payload });
        }
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

    public disconnect(): void {
        this.reconnectAttempts = this.maxReconnectAttempts;
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.ws) {
            this.ws.close(1000, 'Client disconnecting');
        }
    }

    public getConnectionState(): string {
        if (!this.ws) return 'CLOSED';

        switch (this.ws.readyState) {
            case WebSocket.CONNECTING: return 'CONNECTING';
            case WebSocket.OPEN: return 'OPEN';
            case WebSocket.CLOSING: return 'CLOSING';
            case WebSocket.CLOSED: return 'CLOSED';
            default: return 'UNKNOWN';
        }
    }
}