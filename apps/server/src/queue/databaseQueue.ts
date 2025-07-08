import Bull from "bull";
import { prisma } from "../lib/prisma";
import { redisClient } from "../lib/redis";
import Redis from "ioredis";
import { QueueJobTypes } from "../types/RedisQueueOperationTypes";
const REDIS_URL = process.env.REDIS_URL;
const databaseQueue = new Bull('database-operations', {
    redis: REDIS_URL
})

databaseQueue.process(QueueJobTypes.CREATE_PARTICIPANT, async (job) => {
    const { liveSessionId, participantData } = job.data;

    try {
        const participant = await prisma.participant.create({
            data: {
                sessionId: liveSessionId,
                name: participantData.name,
                avatar: participantData.avatar
            }
        })

        await redisClient.hset(
            `session:${liveSessionId}:participants`,
            participant.id,
            JSON.stringify({
                ...participant,
                socketId: participantData.socketId
            })
        )

        return { success: true, participant };

    } catch (err) {
        console.log("Error in creating participant", err);
    }
})

databaseQueue.process(QueueJobTypes.UPDATE_PARTICIPANT_SCORE, async (job) => {
    const { scoreData, participantId } = job.data;
    const participant = await prisma.participant.update({
        where: {
            id: participantId
        },
        data: {
            totalScore: scoreData.totalScore,
            correctCount: scoreData.correctCount,
            incorrectCount: scoreData.incorrectCount
        }
    })

    return { success: true, participant };
})

databaseQueue.process(QueueJobTypes.CREATE_QUESTION_RESPONSE, async (job) => {

})

databaseQueue.process(QueueJobTypes.NAME_CHANGE, async (job) => {
    const { participantId, participantName, sessionId } = job.data;
    const participantKey = `session:${sessionId}:participants`;


    const participant = await prisma.participant.findUnique({
        where: {
            id: participantId
        }
    })

    if (participant.isNameChanged) return;

    await prisma.participant.update({
        where: {
            id: participantId
        }, data: {
            name: participantName,
            isNameChanged: true
        }
    })

    const currentData = await redisClient.hget(
        participantKey,
        participantId,
    )
    if (currentData) {

        const participantRedisCache = JSON.parse(currentData);
        participantRedisCache.name = participantName

        await redisClient.hset(
            participantKey,
            participantId,
            JSON.stringify(participantRedisCache)
        )
        await redisClient.expire(participantKey, 24 * 60 * 60);
    } else {
        console.log(`Cache miss for participant ${participantId} in session ${sessionId}`);
    }
})


export class DatabaseQueue {

    static async createParticipant(liveSessionId: string, participantData: { name: string, avatar: string, socketId: string }) {
        return databaseQueue.add(QueueJobTypes.CREATE_PARTICIPANT,
            {
                liveSessionId,
                participantData
            },
            {
                attempts: 3,
                delay: 1000,
            }
        )
    }

    static updateParticipantName(participantId: string, participantName: string, sessionId: string) {
        return databaseQueue.add(QueueJobTypes.NAME_CHANGE,
            {
                participantId,
                participantName,
                sessionId
            },
            {
                attempts: 3,
                delay: 1000,
            }
        )
    }

}