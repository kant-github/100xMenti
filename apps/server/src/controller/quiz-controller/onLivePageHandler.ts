import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import jwt from 'jsonwebtoken';
import { HostTokenPayload, ParticipantTokenPayload } from "../../types/WebSocketTypes";

export enum UserType {
    HOST = "HOST",
    PARTICIPANT = "PARTICIPANT",
}

export default async function onLivePageHandler(req: Request, res: Response) {
    const headers = req.headers.authorization;
    const token = headers.split(" ")[1];
    const JWT_SECRET = process.env.JWT_SECRET;
    const { quizId } = req.params;

    if (!quizId) {
        res.status(400).json({
            message: "Missing quiz ID"
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as HostTokenPayload | ParticipantTokenPayload;

        const liveSession = await prisma.liveSession.findFirst({
            where: { quizId },
            include: {
                participants: true,
            }
        });

        if (!liveSession) {
            res.status(404).json({
                message: "Live session not found"
            });
            return;
        }

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: true,
                creator: true
            }
        })


        // Type guard: Check if it's a host token
        if (decoded.type === 'host') {
            // Now TypeScript knows decoded is HostTokenPayload
            if (liveSession.hostId === String(decoded.hostId)) {
                res.status(200).json({
                    userType: UserType.HOST,
                    liveSession,
                    quiz: quiz
                });
                return;
            }
        }

        if (decoded.type === 'participant') {
            const participant = liveSession.participants.find(p => p.id === decoded.participantId);
            if (participant) {
                res.status(200).json({
                    userType: UserType.PARTICIPANT,
                    liveSession,
                    quiz: quiz,
                    participant
                });
                return;
            }
        }

        res.status(403).json({
            message: "You are not part of this session"
        });
        return;

    } catch (err) {
        console.error("Error in onLivePageHandler:", err);
        res.status(500).json({ message: "Server error" });
        return;
    }
}