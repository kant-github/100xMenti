import { Server } from "http";
import { Server as WSServer, WebSocket } from "ws";
import { v4 as uuid } from "uuid";
import { CustomWebSocket, MESSAGE_TYPES, ParticipantData, QuizRoom } from "../types/WebSocketTypes";
import { prisma } from "../lib/prisma";
import jwt from 'jsonwebtoken';
import RedisSessionService from "../service/RedisSessionService";
import { LiveSessionCache, ParticipantDataCache } from "../types/RedisLiveSessionTypes";
import { LiveSession } from "@prisma/client";
import { DatabaseQueue } from "../queue/databaseQueue";

export default class WebSocketServer {
    private wss: WSServer;
    private socketMapping: Map<string, CustomWebSocket>;
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

    private async handleJoinQuiz(ws: CustomWebSocket, payload: any) {
        const { participantName, avatar, sessionId, quizId } = payload;

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
        const isHost: boolean = quiz.creator_id === String(ws.user.id)


        if (isHost) {
            this.handleCreateQuiz(ws, payload)
            return;
        }

        if (!participantName) {
            this.sendError(ws, 'Participant name is required');
            return;
        }

        let liveSessionCache: LiveSessionCache = await this.redisService.getLiveSession(sessionId);

        if (!liveSessionCache) {
            const liveSession = await prisma.liveSession.findUnique({
                where: { id: sessionId }
            })
            if (!liveSession) {
                this.sendError(ws, 'Room is not live or does not exist');
                return;
            }

            liveSessionCache = {
                sessionId,
                sessionCode: liveSession.sessionCode,
                hostId: liveSession.hostId,
                quizId: liveSession.quizId,
                currentQuestionIndex: liveSession.currentQuestionIndex,
                currentQuestionId: liveSession.currentQuestionId || '',
                status: liveSession.status,
                questionStartTime: null,
                participants: new Map<string, ParticipantDataCache>(),
            }

            await this.redisService.createSession(sessionId, liveSessionCache);
        }

        await this.addParticipantToRoom(ws, liveSessionCache, { participantName, avatar })
    }

    private async handleCreateQuiz(ws: CustomWebSocket, payload: any) {
        const { participantName, avatar, sessionId, quizId } = payload;

        const liveSession = await prisma.liveSession.findUnique({
            where: { id: sessionId }
        })

        const liveSessionCache: LiveSessionCache = {
            sessionId,
            sessionCode: liveSession.sessionCode,
            hostId: liveSession.hostId,
            quizId: liveSession.quizId,
            currentQuestionIndex: liveSession.currentQuestionIndex,
            currentQuestionId: liveSession.currentQuestionId || '',
            status: liveSession.status,
            questionStartTime: null,
            participants: new Map<string, ParticipantDataCache>(),
        }

        await this.redisService.createSession(sessionId, liveSessionCache);

        this.sendToSocket(ws, {
            type: MESSAGE_TYPES.QUIZ_CREATED,
            payload: {
                sessionId: liveSession.id,
                sessionCode: liveSession.sessionCode,
                status: liveSession.status
            }
        })
    }

    private async addParticipantToRoom(ws: CustomWebSocket, liveSession: LiveSessionCache, participantData: { participantName: string, avatar: string }) {
        try {
            const newParticipant: ParticipantDataCache = {
                id: uuid(),
                name: participantData.participantName,
                avatar: participantData.avatar,
                socketId: ws.id,
                sessionId: liveSession.sessionId,
                isActive: true,
                joinedAt: new Date,
                totalScore: 0,
                correctCount: 0,
                incorrectCount: 0
            }

            await this.redisService.addParticipant(liveSession.sessionId, newParticipant)

            // here I should queue database operation ------------>
            const job = await DatabaseQueue.createParticipant(liveSession.sessionId, {
                name: participantData.participantName,
                avatar: participantData.avatar,
                socketId: ws.id
            })

            job.finished().then((result) => {
                if (result.success && result.participant) {
                    newParticipant.id = result.participant.id;
                    this.redisService.addParticipant(liveSession.sessionId, newParticipant);
                }
            }).catch(console.error);

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