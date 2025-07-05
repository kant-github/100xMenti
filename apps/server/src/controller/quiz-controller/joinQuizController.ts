import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export default async function joinQuizController(req: Request, res: Response) {

    const { sessionCode } = req.params;

    if (!sessionCode) {
        res.status(500).json({
            message: "Session code not found"
        })
        return;
    }

    try {
        const liveSession = await prisma.liveSession.findUnique({
            where: { sessionCode },
            include: { quiz: true }
        });

        if (!liveSession) {
            res.status(404).json({ error: 'Session not found' });
            return;
        }

        const participant = await prisma.participant.create({
            data: {
                name: `User-${Date.now()}`,
                avatar: 'https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-1.jpg',
                isActive: false,
                sessionId: liveSession.id
            }
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
            }
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