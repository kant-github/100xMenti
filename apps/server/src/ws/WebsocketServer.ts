import { Server } from "http";
import { Server as WSServer, WebSocket } from "ws";
import { v4 as uuid } from "uuid";
import { CustomWebSocket, MESSAGE_TYPES } from "../types/WebSocketTypes";



export default class WebSocketServer {
    private wss: WSServer;
    private socketMapping: Map<string, CustomWebSocket>;
    private roomMapping: Map<string, Set<string>> = new Map()


    constructor(server: Server) {
        this.wss = new WSServer({ server });
        this.initialize()
    }

    private initialize() {
        this.wss.on('connection', (ws: CustomWebSocket, url) => {
            const roomId = '';
            const newWebSocketId = uuid()

            ws.id = newWebSocketId;
            this.socketMapping.set(newWebSocketId, ws);
            this.initTracking(ws, roomId);

            ws.on('message', (data: any) => {
                const parsedMessage = JSON.parse(data);
                this.handleIncomingMessage(ws, parsedMessage)
            })
        })
    }

    private initTracking(ws: CustomWebSocket, roomId: string) {

        if (!this.roomMapping.get(roomId)) {
            this.roomMapping.set(roomId, new Set());
        }

        this.roomMapping.get(roomId).add(ws.id);

        ws.send(JSON.stringify({
            message: `You joined the room : ${roomId}`
        }))

    }

    private handleIncomingMessage(ws: CustomWebSocket, message: any) {
        const { type, payload } = message;

        switch (type) {
            case MESSAGE_TYPES.JOIN_QUIZ:
                this.handleJoinQuiz(ws, payload);
                return;
            case MESSAGE_TYPES.LEAVE_QUIZ:
                this.handleLeaveQuiz()
                return;
        }

    }

    private handleJoinQuiz(ws: CustomWebSocket, payload: any) {
        const { sessionCode, participantName, avatar, isHost, hostId, sessionId, quizId } = payload;

        if (sessionCode) {
            this.sendError(ws, 'Session code is required');
            return;
        }

        if(isHost) {

        }
    }

    private handleLeaveQuiz() {

    }

    private handle

    private sendError(ws: CustomWebSocket, message: string) {
        this.sendToSocket(ws, {
            type: MESSAGE_TYPES.ERROR,
            payload: { message }
        })
    }

    private sendToSocket(ws: CustomWebSocket, message: any) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }
}