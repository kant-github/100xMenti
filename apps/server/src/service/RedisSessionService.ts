import Redis from "ioredis";
import { ParticipantData, QuizRoom } from "../types/WebSocketTypes";
import { LiveSessionCache, ParticipantDataCache } from "../types/RedisLiveSessionTypes";

export default class RedisSessionService {
    private redis: Redis

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            maxRetriesPerRequest: 3,
        })
    }

    public async createSession(sessionId: string, liveSession: LiveSessionCache) {
        try {
            const sessionKey = `session:${sessionId}`;
            await this.redis.hmset(sessionKey, {
                sessionCode: liveSession.sessionCode,
                hostId: liveSession.hostId,
                quizId: liveSession.quizId,
                currentQuestionIndex: liveSession.currentQuestionIndex.toString(),
                currentQuestionId: liveSession.currentQuestionId || '',
                status: liveSession.status,
                questionStartTime: liveSession.questionStartTime?.toString() || '',
                createdAt: Date.now().toString()
            })
            await this.redis.expire(sessionKey, 24 * 60 * 60);
        } catch (err) {
            console.error("Error in session management while creating session", err);
        }
    }

    public async getLiveSession(sessionId: string): Promise<LiveSessionCache> {
        const sessionKey = `session:${sessionId}`
        try {
            const sessionData = await this.redis.hgetall(sessionKey);

            if (!sessionData || Object.keys(sessionData).length === 0) {
                return null;
            }

            const participants = await this.getSessionParticipant(sessionId);

            return {
                sessionId,
                sessionCode: sessionData.sessionCode,
                hostId: sessionData.hostId,
                quizId: sessionData.quizId,
                // participants,
                currentQuestionIndex: Number(sessionData.currentQuestionIndex),
                currentQuestionId: sessionData.currentQuestionId || null,
                status: sessionData.status as any,
                questionStartTime: sessionData.questionStartTime ? new Date(parseInt(sessionData.questionStartTime)) : null,
            }
        } catch (err) {
            console.log("Error in fetching the session ", err);
        }
    }

    public async updateSessionStatus(sessionId: string, status: string): Promise<void> {
        await this.redis.hset(`session:${sessionId}`, 'status', status);
    }

    public async updateCurrentQuestion(sessionId: string, questionIndex: number, questionId: string) {
        const sessionKey = `session:${sessionId}`;
        await this.redis.hmset(sessionKey, {
            currentQuestionIndex: questionIndex.toString(),
            currentQuestionId: questionId,
            questionStartTime: Date.now().toString()
        })
    }

    public async addParticipant(sessionId: string, participant: ParticipantDataCache) {
        const participantKey = `session:${sessionId}:participants`
        await this.redis.hset(
            participantKey,
            participant.id,
            JSON.stringify({
                id: participant.id,
                name: participant.name,
                avatar: participant.avatar,
                socketId: participant.socketId,
                totalScore: participant.totalScore,
                correctCount: participant.correctCount,
                incorrectCount: participant.incorrectCount,
                joinedAt: participant.joinedAt,
                isActive: participant.isActive
            })
        )
        await this.redis.expire(participantKey, 24 * 60 * 60);
    }

    public async removeParticipant(sessionId: string, participant: ParticipantDataCache) {
        const participantKey = `session:${sessionId}:participants`
        await this.redis.hdel(participantKey, participant.id);
    }

    public async getSessionParticipant(sessionId: string) {
        const sessionKey = `session:${sessionId}:participants`;
        try {
            const participantsData = await this.redis.hgetall(sessionKey);
            const participants = new Map<string, ParticipantDataCache>();

            for (const [id, data] of Object.entries(participantsData)) {
                try {
                    const participant = JSON.parse(data); participants.set(id, participant);
                } catch (error) {
                    console.error(`Failed to parse participant data for ${id}:`, error);
                }
            }
            return participants;

        } catch (err) {
            console.error("Error in getting session participants", err);
        }
    }

    public async updateParticipantScore(sessionId: string, participantId: string, scoreData: {
        totalScore: number;
        correctCount: number;
        incorrectCount: number;
    }) {
        const participantKey = `session:${sessionId}:participants`;

        await this.redis.hset(
            participantKey,
            participantId,
        )
    }
}