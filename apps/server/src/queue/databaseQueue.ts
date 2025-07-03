import Bull from "bull";
import { prisma } from "../lib/prisma";
import { redisClient } from "../lib/redis";

export enum OPERATION_TYPES {
    CREATE_PARTICIPANT = 'CREATE_PARTICIPANT',
    UPDATE_PARTICIPANT_SCORE = 'UPDATE_PARTICIPANT_SCORE',
    CREATE_QUESTION_RESPONSE = 'CREATE_QUESTION_RESPONSE',
}

const databaseQueue = new Bull('database-operations', {
    redis: {
        host: 'localhost',
        port: 6379,
        password: 'rishi123'
    }
})

databaseQueue.process(OPERATION_TYPES.CREATE_PARTICIPANT, async (job) => {
    const { sessionId, participantData } = job.data;

    try {
        const participant = await prisma.participant.create({
            data: {
                sessionId: sessionId,
                name: participantData.name,
                avatar: participantData.avatar
            }
        })

        await redisClient.hset(
            `sessiom:${sessionId}:participants`,
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

databaseQueue.process(OPERATION_TYPES.UPDATE_PARTICIPANT_SCORE, async (job) => {
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

databaseQueue.process(OPERATION_TYPES.CREATE_QUESTION_RESPONSE, async (job) => {
    
})
