import { Server } from "http";
import { Server as WSServer, WebSocket } from "ws";
import { v4 as uuid } from "uuid";
import { CustomWebSocket, HostTokenPayload, MESSAGE_TYPES, ParticipantData, ParticipantTokenPayload, QuizRoom } from "../types/WebSocketTypes";
import { prisma } from "../lib/prisma";
import jwt from 'jsonwebtoken';
import RedisSessionService from "../service/RedisSessionService";
import { LiveSessionCache, ParticipantDataCache } from "../types/RedisLiveSessionTypes";
import { SessionStatus } from "@prisma/client";

export default class WebSocketServer {
    private wss: WSServer;
    private socketMapping: Map<string, CustomWebSocket> = new Map();
    private roomMapping: Map<string, Set<string>> = new Map() // liveSessionID -> Set(socketIds) 
    private quizMapping: Map<string, QuizRoom> = new Map(); // liveSessionID -> Quiz
    private socketToRoom: Map<string, string> = new Map(); // socketId -> liveSessionID
    private redisService: RedisSessionService;

    constructor(server: Server) {
        this.wss = new WSServer({ server });
        this.redisService = new RedisSessionService();
        this.initialize()
    }

    private initialize() {
        this.wss.on('connection', (ws: CustomWebSocket, request) => {
            if (!this.authenticateConnection(ws, request)) {
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
            case MESSAGE_TYPES.LIKE:
                this.handleLike(ws, payload)
                break;
            default:
                throw new Error('Unknown type came')
        }
    }

    private async handleJoinQuiz(ws: CustomWebSocket, payload: any) {
        const { sessionId, quizId } = payload;
        console.log("payload is : ", payload);
        let participantId: string;

        if (this.isParticipantToken(ws.user)) {
            participantId = ws.user.participantId;
        }
        console.log("participant id is : ", participantId);

        if (!sessionId) {
            this.sendError(ws, 'Session code is required');
            return;
        }

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                creator: true
            }
        })

        console.log("quiz is : ", quiz);

        let isHost: boolean = false;
        if (this.isHostToken(ws.user)) {
            isHost = quiz.creator_id === String(ws.user.hostId);
        }

        if (isHost) {
            this.handleCreateQuiz(ws, payload)
            return;
        }

        if (!this.isParticipantToken(ws.user)) {
            this.sendError(ws, 'Invalid user type for joining quiz');
            return;
        }

        if (!participantId) {
            this.sendError(ws, 'Participant name is required');
            return;
        }

        let liveSessionCache: LiveSessionCache = await this.redisService.getLiveSession(sessionId);

        if (!liveSessionCache) {
            this.sendError(ws, 'Quiz session has not been started by the host. Please wait for the host to start the session.');
            return;
        }

        if (liveSessionCache.status === SessionStatus.IN_PROGRESS && !liveSessionCache.allowLateJoin) {
            this.sendError(ws, 'Quiz is already in progress and late joining is not allowed');
            return;
        }

        if (liveSessionCache.status === SessionStatus.FINISHED) {
            this.sendError(ws, 'Quiz session has already ended');
            return;
        }

        await this.addParticipantToRoom(ws, liveSessionCache, participantId)
    }

    private async handleCreateQuiz(ws: CustomWebSocket, payload: any) {
        if (!this.isHostToken(ws.user)) {
            this.sendError(ws, 'Only hosts can create quiz sessions');
            return;
        }

        const { sessionId } = payload;

        const liveSession = await prisma.liveSession.findUnique({
            where: { id: sessionId }
        })

        console.log("live session is : ", liveSession);
        if (!liveSession) {
            this.sendError(ws, 'Live session not found');
            return;
        }

        const liveSessionCache: LiveSessionCache = {
            sessionId,
            sessionCode: liveSession.sessionCode,
            hostId: liveSession.hostId,
            quizId: liveSession.quizId,
            currentQuestionIndex: liveSession.currentQuestionIndex,
            currentQuestionId: liveSession.currentQuestionId || '',
            status: liveSession.status,
            allowLateJoin: false,
            questionStartTime: null,
            participants: new Map<string, ParticipantDataCache>(),
        }
        console.log("live session cache data is : ", liveSessionCache);
        await this.redisService.createSession(sessionId, liveSessionCache);

        this.joinRoom(ws, sessionId);

        this.sendToSocket(ws, {
            type: MESSAGE_TYPES.QUIZ_CREATED,
            payload: {
                sessionId: liveSession.id,
                sessionCode: liveSession.sessionCode,
                status: liveSession.status,
            }
        })
        console.log("done");
    }

    private async addParticipantToRoom(ws: CustomWebSocket, liveSession: LiveSessionCache, participantId: string) {
        try {
            const participant = await prisma.participant.findUnique({
                where: { id: participantId }
            })

            if (!participant) {
                this.sendError(ws, 'Participant not found');
                return;
            }

            const newParticipant: ParticipantDataCache = {
                id: uuid(),
                name: participant.name,
                avatar: participant.avatar,
                socketId: ws.id,
                sessionId: liveSession.sessionId,
                isActive: true,
                joinedAt: new Date,
                totalScore: 0,
                correctCount: 0,
                incorrectCount: 0
            }

            await this.redisService.addParticipant(liveSession.sessionId, newParticipant)

            this.joinRoom(ws, liveSession.sessionId);

            this.sendToSocket(ws, {
                type: MESSAGE_TYPES.JOINED_QUIZ,
                payload: {
                    liveSessionId: liveSession.sessionId,
                    participantId: newParticipant.id,
                    currentQuestionIndex: liveSession.currentQuestionIndex,
                    status: liveSession.status
                }
            })

            this.broadcastToRoom(liveSession.sessionId, {
                type: MESSAGE_TYPES.PARTICIPANT_JOINED,
                payload: {
                    participantId: newParticipant.id,
                    avatar: newParticipant.avatar,
                    name: newParticipant.name
                }
            }, ws.id)

        } catch (err) {
            console.error('Error adding participant to room:', err);
            this.sendError(ws, 'Failed to join quiz');
        }
    }

    private handleLeaveQuiz() {
        // Implementation for leaving quiz
    }

    private joinRoom(ws: CustomWebSocket, sessionId: string) {
        console.log(this.roomMapping.get(sessionId));
        if (!this.roomMapping.get(sessionId)) {
            this.roomMapping.set(sessionId, new Set());
        }
        this.roomMapping.get(sessionId).add(ws.id);
        this.socketToRoom.set(ws.id, sessionId);
        console.log(this.roomMapping.get(sessionId));
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

    private broadcastToRoom(sessionId: string, message: any, excludeSocketId?: string) {
        const socketIds = this.roomMapping.get(sessionId);
        if (!socketIds) return;

        socketIds.forEach(socketId => {
            if (socketId !== excludeSocketId) {
                const socket = this.socketMapping.get(socketId);
                if (socket) {
                    this.sendToSocket(socket, message);
                }
            }
        });
    }

    private handleLike(ws: CustomWebSocket, payload: any) {
        const { sessionId } = payload;

        this.broadcastToRoom(sessionId, {
            type: MESSAGE_TYPES.LIKE,
            payload: {
                ...payload
            }
        }, ws.id)
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
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as HostTokenPayload | ParticipantTokenPayload;
                console.log("decoded is : ----------------------------------> \n", decoded);
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

    private isHostToken(user: HostTokenPayload | ParticipantTokenPayload): user is HostTokenPayload {
        return user.type === 'host';
    }

    private isParticipantToken(user: HostTokenPayload | ParticipantTokenPayload): user is ParticipantTokenPayload {
        return user.type === 'participant';
    }

}