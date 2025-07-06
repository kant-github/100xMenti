import Bull from "bull";
import { prisma } from "../lib/prisma";
import { redisClient } from "../lib/redis";
import Redis from "ioredis";
import { QueueJobTypes } from "../types/RedisQueueOperationTypes";

const databaseQueue = new Bull('database-operations', {
    redis: 'rediss://default:AYEUAAIjcDFlNzMzOWZlMmVlZjA0M2IxYmU1ZWU3MjA4NjAyYzYyOHAxMA@accepted-lamb-33044.upstash.io:6379'
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
            `sessiom:${liveSessionId}:participants`,
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


export class DatabaseQueue {
    static async createParticipant(liveSessionId: string, participantData: {
        name: string,
        avatar: string,
        socketId: string
    }) {
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
}