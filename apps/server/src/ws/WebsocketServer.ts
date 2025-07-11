import { Server } from "http";
import { Server as WSServer, WebSocket } from "ws";
import { v4 as uuid } from "uuid";
import { CustomWebSocket, HostTokenPayload, MESSAGE_TYPES, ParticipantTokenPayload } from "../types/WebSocketTypes";
import { prisma } from "../lib/prisma";
import jwt from 'jsonwebtoken';
import RedisSessionService from "../service/RedisSessionService";
import { LiveSessionCache, ParticipantDataCache } from "../types/RedisLiveSessionTypes";
import { HostScreen, ParticipantScreen, Question, SessionStatus } from "@prisma/client";
import { DatabaseQueue } from "../queue/databaseQueue";
interface WebSocketMessage {
    type: string;
    payload: any
}

export default class WebSocketServer {
    private wss: WSServer;
    private socketMapping: Map<string, CustomWebSocket> = new Map();
    private roomMapping: Map<string, Set<string>> = new Map() // liveSessionID -> Set(socketIds) 
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

            ws.on('message', async (data: any) => {

                try {
                    const parsedMessage = JSON.parse(data);
                    this.handleIncomingMessage(ws, parsedMessage)
                } catch (err) {
                    console.log("Error in incoming message");
                }
            })
            ws.on('close', () => {
                this.handleSocketClose(ws);
            })
        })
    }

    private handleSocketClose(ws: CustomWebSocket) {
        try {
            const socketId = ws.id;
            const liveSessionId = this.socketToRoom.get(socketId);
            if (liveSessionId) {
                this.handleLeaveRoom(ws, liveSessionId);
            }
            this.socketMapping.delete(ws.id);
        } catch (err) {

        }
    }

    private handleLeaveRoom(ws: CustomWebSocket, liveSessionId: string) {
        const roomSockets = this.roomMapping.get(liveSessionId);

        if (roomSockets) {
            roomSockets.delete(ws.id);
            if (roomSockets.size === 0) {
                this.roomMapping.delete(liveSessionId);
            }
        }
        this.socketToRoom.delete(ws.id);
    }

    private handleIncomingMessage(ws: CustomWebSocket, message: any) {
        const { type, payload } = message;
        console.log("ws message came : ", type);
        switch (type) {
            case MESSAGE_TYPES.JOIN_QUIZ:
                this.handleJoinQuiz(ws, payload);
                break;
            case MESSAGE_TYPES.START_QUIZ:
                this.handleStartQuiz(ws, payload);
                break;
            case MESSAGE_TYPES.LAUNCH_QUESTION:
                this.handleLaunchQuestion(ws, payload);
                break;
            case MESSAGE_TYPES.LEAVE_QUIZ:
                this.handleLeaveQuiz()
                break;
            case MESSAGE_TYPES.LIKE:
                this.handleLike(ws, payload)
                break;
            case MESSAGE_TYPES.NAME_CHANGE:
                this.handleNameChange(ws, payload)
                break;
            default:
                throw new Error('Unknown type came')
        }
    }

    private async handleLaunchQuestion(ws: CustomWebSocket, payload: any) {
        if (!this.isHostToken(ws.user)) {
            this.sendError(ws, "Only host can launch the question")
            return;
        }

        const { sessionId } = payload;

        const liveSession = await this.redisService.getLiveSession(sessionId);
        if (!liveSession) {
            this.sendError(ws, "Session is not found")
            return;
        }
        if (liveSession.status !== SessionStatus.LIVE) {
            this.sendError(ws, "Quiz is not live");
            return;
        }


        try {
            const quiz = await prisma.quiz.findUnique({
                where: { id: liveSession.quizId },
                include: {
                    questions: {
                        orderBy: { createdAt: 'asc' }
                    }
                }
            });

            if (!quiz || !quiz.questions.length) {
                this.sendError(ws, 'No questions found');
                return;
            }


            const currentQuestion = quiz.questions[liveSession.currentQuestionIndex];
            if (!currentQuestion) {
                this.sendError(ws, 'Question not found');
                return;
            }

            await this.redisService.updateSession(sessionId, {
                currentQuestionId: currentQuestion.id,
                currentQuestionPhase: 'MOTIVATION',
                questionData: currentQuestion,
                questionStartTime: new Date(),
                hostScreen: HostScreen.QUESTION_ACTIVE,
                participantScreen: ParticipantScreen.COUNTDOWN
            })

            DatabaseQueue.updateLiveSession(sessionId, {
                currentQuestionId: currentQuestion.id,
                hostScreen: HostScreen.QUESTION_ACTIVE,
                participantScreen: ParticipantScreen.COUNTDOWN
            })

            this.startMotivationPhase(sessionId, currentQuestion)
        } catch (err) {
            console.error('Error launching question:', err);
            this.sendError(ws, 'Failed to launch question');
        }
    }

    private async startMotivationPhase(sessionId: string, question: Question) {
        this.broadcastToRoom(sessionId, {
            type: MESSAGE_TYPES.QUESTION_MOTIVATION,
            payload: {
                message: "Answer quickly to get more points",
            }
        })

        const hostSocket = this.getHostSocket(sessionId);
        if (hostSocket) {
            this.sendToSocket(hostSocket, {
                type: MESSAGE_TYPES.QUESTION_MOTIVATION,
                payload: {
                    phase: 'MOTIVATION',
                    questionData: question,
                    // participantCount: await this.getActiveParticipantCount(sessionId)
                }
            });
        }

        setTimeout(() => {
            this.startReadingPhase(sessionId, question);
        }, 3000)
    }

    private async startReadingPhase(sessionId: string, question: Question) {
        const readingEndTime = new Date(Date.now() + 5000);

        await this.redisService.updateSession(sessionId, {
            currentQuestionPhase: 'READING',
            readingPhaseEndTime: readingEndTime
        })

        this.broadcastToRoom(sessionId, {
            type: MESSAGE_TYPES.QUESTION_READING,
            payload: {
                questionId: question.id,
                title: question.title,
                type: question.type,
                points: question.points,
                readingTimeLeft: 5000,
            }
        })

        const hostSocket = this.getHostSocket(sessionId);
        if (hostSocket) {
            this.sendToSocket(hostSocket, {
                type: MESSAGE_TYPES.QUESTION_READING,
                payload: {
                    phase: 'READING',
                    timeLeft: 5000,
                    questionData: question
                }
            });
        }

        setTimeout(() => {
            this.startAnsweringPhase(sessionId, question);
        }, 5000);

    }

    private async startAnsweringPhase(sessionId: string, question: Question) {
        const questionEndTime = new Date(Date.now() + (question.timing * 1000));

        await this.redisService.updateSession(sessionId, {
            currentQuestionPhase: 'ANSWERING',
            questionEndTime
        })

        this.broadcastToRoom(sessionId, {
            type: MESSAGE_TYPES.QUESTION_ANSWERING,
            payload: {
                questionId: question.id,
                title: question.title,
                type: question.type,
                points: question.points,
                options: question.options,
                timeLimit: question.timing,
                timeLeft: question.timing * 1000,
            }
        });
    }

    private getHostSocket(sessionId: string): CustomWebSocket | null {
        const socketIds = this.roomMapping.get(sessionId);
        if (!socketIds) return null;

        for (const socketId of socketIds) {
            const socket = this.socketMapping.get(socketId);
            if (socket && this.isHostToken(socket.user)) {
                return socket;
            }
        }
        return null;
    }

    private async handleStartQuiz(ws: CustomWebSocket, payload: any) {
        const { sessionId } = payload;

        await this.redisService.updateSession(sessionId, {
            hostScreen: HostScreen.QUESTION_PREVIEW,
            status: SessionStatus.LIVE,
            participantScreen: ParticipantScreen.LOBBY,
        })
        DatabaseQueue.updateLiveSession(sessionId, {
            hostScreen: HostScreen.QUESTION_PREVIEW,
            status: SessionStatus.LIVE,
            participantScreen: ParticipantScreen.LOBBY,
        });

        this.sendToSocket(ws, {
            type: MESSAGE_TYPES.QUESTION_PREVIEW,
            payload: {
                hostScreen: HostScreen.QUESTION_PREVIEW,
                status: SessionStatus.LIVE,
            }
        })

    }

    private async handleNameChange(ws: CustomWebSocket, payload: any) {
        const { participantId, participantName } = payload;
        if (ws.user.type !== 'participant') {
            this.sendError(ws, 'Only participants can change names');
            return;
        }

        if (ws.user.participantId !== participantId) {
            this.sendError(ws, 'Unauthorized');
            return;
        }
        console.log(ws.id);
        const sessionId = this.socketToRoom.get(ws.id);
        if (!sessionId) {
            this.sendError(ws, 'Session not found');
            return;
        }

        if (!participantName || typeof participantName !== 'string' || participantName.trim().length === 0) {
            this.sendError(ws, 'Invalid participant name');
            return;
        }

        try {
            await DatabaseQueue.updateParticipantName(participantId, participantName.trim(), sessionId);
            this.broadcastToRoom(sessionId, {
                type: MESSAGE_TYPES.NAME_CHANGE,
                payload
            })
        } catch (error) {
            console.error('Failed to queue name change:', error);
            this.sendError(ws, 'Failed to update name');
        }
    }

    private async handleJoinQuiz(ws: CustomWebSocket, payload: any) {
        const { sessionId, quizId } = payload;
        let participantId: string;

        if (this.isParticipantToken(ws.user)) {
            participantId = ws.user.participantId;
        }

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

        if (!quiz) {
            return this.sendError(ws, 'Quiz not found');
        }

        let liveSessionCache: LiveSessionCache = await this.redisService.getLiveSession(sessionId);
        const isHost = this.isHostToken(ws.user) && quiz.creator_id === String(ws.user.hostId);

        if (isHost) {
            this.handleHostJoin(ws, payload, liveSessionCache)
            return;
        }

        this.handleParticipantJoin(ws, sessionId, liveSessionCache);
        return;
    }

    private handleHostJoin(ws: CustomWebSocket, payload: any, liveSessionCache: LiveSessionCache | null) {
        const { sessionId } = payload;
        if (!liveSessionCache) {
            this.handleCreateQuiz(ws, payload);
            return;
        }

        this.joinRoom(ws, sessionId);
        this.sendToSocket(ws, {
            type: MESSAGE_TYPES.QUIZ_CREATED,
            payload: {
                sessionId: liveSessionCache.sessionId,
                sessionCode: liveSessionCache.sessionCode,
                status: liveSessionCache.status,
            }
        });
    }

    private async handleParticipantJoin(ws: CustomWebSocket, payload: any, liveSessionCache: LiveSessionCache | null) {
        const { sessionId } = payload;
        if (!this.isParticipantToken(ws.user)) {
            return this.sendError(ws, 'Invalid user type for joining quiz');
        }

        const participantId = ws.user.participantId;
        if (!participantId) {
            return this.sendError(ws, 'Participant name is required');
        }

        if (!liveSessionCache) {
            return this.sendError(ws, 'Quiz session has not been started by the host. Please wait for the host to start the session.');
        }

        if (liveSessionCache.status === SessionStatus.COMPLETED) {
            return this.sendError(ws, 'Quiz session has already ended');
        }

        if (liveSessionCache.status === SessionStatus.LIVE && !liveSessionCache.allowLateJoin) {
            const canRejoin = await this.canParticipantRejoin(sessionId, participantId);
            if (!canRejoin) {
                return this.sendError(ws, 'Quiz is already in progress and late joining is not allowed');
            }
        }
        this.addParticipantToRoom(ws, liveSessionCache, participantId);
        return;
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
            hostScreen: liveSession.hostScreen,
            participantScreen: liveSession.participantScreen,
            allowLateJoin: false,
            questionStartTime: null,
            participants: new Map<string, ParticipantDataCache>(),

            currentQuestionPhase: null,
            questionData: null,
            questionEndTime: null,
            readingPhaseEndTime: null
        }
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
    }

    private async addParticipantToRoom(ws: CustomWebSocket, liveSession: LiveSessionCache, participantId: string) {
        try {
            console.log("participant join started");
            const participant = await prisma.participant.findUnique({
                where: { id: participantId }
            })

            if (!participant) {
                this.sendError(ws, 'Participant not found');
                return;
            }

            const existingParticipant = await this.redisService.getParticipant(liveSession.sessionId, participantId);

            if (existingParticipant) {
                await this.redisService.updateParticipant(liveSession.sessionId, participantId, {
                    socketId: ws.id,
                    isActive: true
                })
                this.joinRoom(ws, liveSession.sessionId);
                return;
            }

            const newParticipant: ParticipantDataCache = {
                id: participantId,
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
            console.log("logging sockets : ", this.roomMapping.get(liveSession.sessionId));
            this.sendToSocket(ws, {
                type: MESSAGE_TYPES.JOINED_QUIZ,
                payload: {
                    liveSessionId: liveSession.sessionId,
                    participantId: newParticipant.id,
                    currentQuestionIndex: liveSession.currentQuestionIndex,
                    status: liveSession.status
                }
            })

            console.log("sent to socket");

            this.broadcastToRoom(liveSession.sessionId, {
                type: MESSAGE_TYPES.PARTICIPANT_JOINED,
                payload: {
                    liveSessionId: liveSession.sessionId,
                    participantId: newParticipant.id,
                    avatar: newParticipant.avatar,
                    name: newParticipant.name
                }
            }, ws.id)
            console.log("broadcasted");

        } catch (err) {
            console.error('Error adding participant to room:', err);
            this.sendError(ws, 'Failed to join quiz');
        }
    }

    private handleLeaveQuiz() {
        // Implementation for leaving quiz
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

    private sendToSocket(ws: CustomWebSocket, message: WebSocketMessage) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }

    private broadcastToRoom(sessionId: string, message: WebSocketMessage, excludeSocketId?: string) {
        const socketIds = this.roomMapping.get(sessionId);
        if (!socketIds) return;
        console.log("socket ids are : ", socketIds);
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

    private async canParticipantRejoin(sessionId: string, participantId: string): Promise<boolean> {
        const existingParticipant = await this.redisService.getParticipant(sessionId, participantId);
        if (existingParticipant) return true;
        return false;
    }
}

