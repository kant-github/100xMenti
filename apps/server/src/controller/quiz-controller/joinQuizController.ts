import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import jwt from 'jsonwebtoken'
import GenerateUser from "../../lib/GenerateUser";

export default async function joinQuizController(req: Request, res: Response) {
    const { sessionCode } = req.params;
    const JWT_SECRET = process.env.JWT_SECRET;

    // Basic validation
    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined');
        res.status(500).json({
            error: 'Server configuration error'
        });
        return;
    }

    if (!sessionCode) {
        res.status(400).json({
            success: false,
            error: "Session code is required"
        });
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
            res.status(404).json({
                success: false,
                error: 'Session not found'
            });
            return;
        }

        switch (liveSession.status) {
            case 'LIVE':
                res.status(200).json({
                    success: false,
                    message: 'Quiz is already in progress'
                });
                return;
            case 'COMPLETED':
                res.status(200).json({
                    success: false,
                    message: 'Quiz session has already ended'
                });
                return;
        }


        if (!liveSession.quiz) {
            res.status(200).json({
                success: false,
                message: 'Quiz not found'
            });
            return;
        }

        const participant = await prisma.participant.create({
            data: {
                name: GenerateUser.getRandomName(),
                avatar: GenerateUser.getRandomAvatar(),
                isActive: false,
                sessionId: liveSession.id
            }
        });

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
        });

        res.status(200).json({
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
                id: liveSession.quizId,
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