import Redis from "ioredis";
import { ParticipantData } from "../types/WebSocketTypes";
import { LiveSessionCache, ParticipantDataCache } from "../types/RedisLiveSessionTypes";
import { HostScreen, ParticipantScreen } from "@prisma/client";

const REDIS_URL = process.env.REDIS_URL;

export default class RedisSessionService {
    private redis: Redis

    constructor() {
        this.redis = new Redis(REDIS_URL);
    }

    public async createSession(sessionId: string, liveSession: LiveSessionCache) {
        try {
            const sessionKey = `session:${sessionId}`;
            await this.redis.hmset(sessionKey, liveSession)
            await this.redis.expire(sessionKey, 24 * 60 * 60);
        } catch (err) {
            console.error("Error in session management while creating session", err);
        }
    }

    public async updateSession(sessionId: string, liveSession: Partial<LiveSessionCache>) {
        try {
            const sessionKey = `session:${sessionId}`;
            await this.redis.hmset(sessionKey, liveSession)
            await this.redis.expire(sessionKey, 24 * 60 * 60);
        } catch (err) {
            console.error("Error in session management while creating session", err);
        }
    }

    public async getLiveSession(sessionId: string): Promise<LiveSessionCache> {
        const sessionKey = `session:${sessionId}`;
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
                hostScreen: sessionData.hostScreen as HostScreen,
                participantScreen: sessionData.participantScreen as ParticipantScreen,
                currentQuestionIndex: Number(sessionData.currentQuestionIndex),
                currentQuestionId: sessionData.currentQuestionId || null,
                status: sessionData.status as any,
                questionStartTime: sessionData.questionStartTime ? new Date(parseInt(sessionData.questionStartTime)) : null,
                allowLateJoin: sessionData.allowLateJoin === 'true'
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

    public async getParticipant(sessionId: string, participantId: string): Promise<ParticipantDataCache | null> {
        const participantKey = `session:${sessionId}:participants`;
        try {
            const participantData = await this.redis.hget(participantKey, participantId);
            if (!participantData) {
                return null;
            }
            return JSON.parse(participantData);
        } catch (err) {
            console.error(`Error getting participant ${participantId} from session ${sessionId}:`, err);
            return null;
        }
    }

    public async updateParticipant(sessionId: string, participantId: string, updates: Partial<ParticipantDataCache>): Promise<void> {
        const participantKey = `session:${sessionId}:participants`;
        try {
            const existingParticipant = await this.getParticipant(sessionId, participantId);
            if (!existingParticipant) {
                console.error(`Participant ${participantId} not found in session ${sessionId}`);
                return;
            }

            const updatedParticipant = {
                ...existingParticipant,
                ...updates
            };

            await this.redis.hset(
                participantKey,
                participantId,
                JSON.stringify(updatedParticipant)
            );
            await this.redis.expire(participantKey, 24 * 60 * 60);
        } catch (err) {
            console.error(`Error updating participant ${participantId} in session ${sessionId}:`, err);
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