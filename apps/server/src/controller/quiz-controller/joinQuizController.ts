import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import jwt from 'jsonwebtoken'
import GenerateUser from "../../lib/generateUser";
export default async function joinQuizController(req: Request, res: Response) {

    const { sessionCode } = req.params;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined');
        res.status(500).json({
            error: 'Server configuration error'
        });
        return;
    }

    if (!sessionCode) {
        res.status(500).json({
            message: "Session code not found"
        })
        return;
    }

    try {
        const liveSession = await prisma.liveSession.findUnique({
            where: { sessionCode },
            include: {
                quiz: true,
                participants: true
            },
        });

        if (!liveSession) {
            res.status(404).json({ error: 'Session not found' });
            return;
        }

        const participant = await prisma.participant.create({
            data: {
                name: GenerateUser.getRandomName(),
                avatar: GenerateUser.getRandomAvatar(),
                isActive: false,
                sessionId: liveSession.id
            }
        })

        const participantTokenPayload = {
            participantId: participant.id,
            sessionId: liveSession.id,
            quizId: liveSession.quizId,
            type: 'participant',
            name: participant.name,
            avatar: participant.avatar
        };


        const participantToken = jwt.sign(participantTokenPayload, JWT_SECRET, {
            expiresIn: '2h',
            issuer: 'quiz-app',
            audience: 'quiz-participant'
        })


        res.json({
            success: true,
            participant: {
                id: participant.id,
                name: participant.name,
                avatar: participant.avatar
            },

            session: {
                id: liveSession.id,
                code: liveSession.sessionCode,
                status: liveSession.status
            },
            quiz: {
                id: liveSession.quizId
            },
            token: participantToken
        });
        return;
    } catch (err) {
        console.error('Join session error:', err);
        res.status(500).json({
            error: 'Failed to join session'
        });
        return;
    }
}