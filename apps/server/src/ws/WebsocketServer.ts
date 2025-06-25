import { Server } from "http";
import { Server as WSServer, WebSocket } from "ws";
import { v4 as uuid } from "uuid";
import { CustomWebSocket, MESSAGE_TYPES, QuizRoom } from "../types/WebSocketTypes";
import { prisma } from "../lib/prisma";



export default class WebSocketServer {
    private wss: WSServer;
    private socketMapping: Map<string, CustomWebSocket>;
    private roomMapping: Map<string, Set<string>> = new Map() // liveSessionID -> Set(socketIds) 
    private quizMapping: Map<string, QuizRoom> = new Map(); // liveSessionID -> Quiz
    private socketToRoom: Map<string, string> = new Map(); // socketId -> liveSessionID

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

            ws.on('message', (data: any) => {
                try {
                    const parsedMessage = JSON.parse(data);
                    this.handleIncomingMessage(ws, parsedMessage)
                } catch (err) {
                    console.log("Error in incoming message");
                }
            })
        })
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

        if (isHost) {
            this.handleCreateQuiz(ws, payload)
        }

        if (!participantName) {
            this.sendError(ws, 'Add your name');
            return;
        }

        const room = this.quizMapping.get(sessionCode);

        if (!room) {
            this.sendError(ws, 'Room is not live');
            return;
        }

        this.addParticipantToRoom()
    }

    private addParticipantToRoom() {

    }

    private handleLeaveQuiz() {

    }

    private async handleCreateQuiz(ws: CustomWebSocket, payload: any) {
        const { quizId } = payload;


        const liveSession = await prisma.liveSession.findFirst({
            where: {
                quizId: quizId
            }, include: { quiz: true, host: true }
        })

        const quiz: QuizRoom = {
            sessionId: liveSession.id,
            sessionCode: liveSession.sessionCode,
            hostId: liveSession.hostId,
            quizId: liveSession.quizId,
            participants: new Map(),
            currentQuestionIndex: liveSession.currentQuestionIndex,
            currentQuestionId: liveSession.currentQuestionId,
            status: liveSession.status,
            questionStartTime: null,
        }

        this.quizMapping.set(quiz.sessionId, quiz);
        this.joinRoom(ws, quiz.sessionId)
    }

    private joinRoom(ws: CustomWebSocket, sessionId: string) {
        if (!this.roomMapping.get(sessionId)) {
            this.roomMapping.set(sessionId, new Set());
        }
        this.roomMapping.get(sessionId).add(ws.id);
        this.socketToRoom.set(ws.id, sessionId);
    }

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