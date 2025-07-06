import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export enum UserType {
    HOST = "HOST",
    PARTICIPANT = "PARTICIPANT",
}

export default async function onLivePageHandler(req: Request, res: Response) {
    const user = req.user;

    if (!user || !user.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { participantId } = req.query;
    const { quizId } = req.params;



    if (!quizId) {
        res.status(400).json({
            message: "Missing quiz ID"
        });
        return;
    }

    try {
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

        if (liveSession.hostId === String(user.id)) {
            res.status(200).json({
                userType: UserType.HOST,
                liveSession,
                quiz: quiz
            });
            return;
        }

        if (participantId) {
            const participant = liveSession.participants.find(p => p.id === participantId);
            if (participant) {
                res.status(200).json({
                    userType: UserType.PARTICIPANT,
                    liveSession,
                    quiz: quiz
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
