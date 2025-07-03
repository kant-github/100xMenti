import { Server } from "http";
import { Server as WSServer, WebSocket } from "ws";
import { v4 as uuid } from "uuid";
import { CustomWebSocket, MESSAGE_TYPES, ParticipantData, QuizRoom } from "../types/WebSocketTypes";
import { prisma } from "../lib/prisma";
import jwt from 'jsonwebtoken';

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
            if (!this.authenticateConnection(ws, url)) {
                return;
            }

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
                break;
            case MESSAGE_TYPES.LEAVE_QUIZ:
                this.handleLeaveQuiz()
                break;
            default:
                throw new Error('Unknown type came')
        }
    }

    private handleJoinQuiz(ws: CustomWebSocket, payload: any) {
        const { participantName, avatar, isHost, sessionId, quizId } = payload;

        if (!sessionId) {
            this.sendError(ws, 'Session code is required');
            return;
        }

        if (isHost) {
            this.handleCreateQuiz(ws, payload)
        }

        if (!participantName) {
            this.sendError(ws, 'Participant name is required');
            return;
        }

        const room = this.quizMapping.get(sessionId);

        if (!room) {
            this.sendError(ws, 'Room is not live or does not exist');
            return;
        }

        this.addParticipantToRoom(ws, room)
    }

    private async addParticipantToRoom(ws: CustomWebSocket, room: QuizRoom) {
        const participant = await prisma.participant.findUnique({
            where: { id: String(ws.user.id) }
        });
        if (!participant) {
            this.sendToSocket(ws, 'Participant not found');
            return;
        }
        const participantData: ParticipantData = {
            ...participant,
            socketId: ws.id
        }
        room.participants.set(participant.id, participantData);
        this.joinRoom(ws, room.sessionId);
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

        if (!liveSession) {
            this.sendError(ws, 'Live session not found');
            return;
        }

        if (liveSession.hostId !== String(ws.user.id)) {
            this.sendError(ws, 'Unauthorized to host this quiz');
            return;
        }

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

    private authenticateConnection(ws: CustomWebSocket, request: any): boolean {
        try {
            const url = new URL(request.url, `http://${request.headers.host}`);
            const token = url.searchParams.get('token');

            if (!token) {
                ws.close(1008, 'Authentication required - no token provided');
                return false;
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
                ws.user = decoded;
                return true;
            } catch (jwtError) {
                console.error('JWT verification failed:', jwtError);
                ws.close(1008, 'Invalid authentication token');
                return false;
            }
        } catch (error) {
            console.error('Authentication error:', error);
            ws.close(1008, 'Authentication failed');
            return false;
        }
    }
}