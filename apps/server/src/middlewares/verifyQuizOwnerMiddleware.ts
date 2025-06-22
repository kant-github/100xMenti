import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export default async function verifyQuizOwnerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { quizId } = req.params;

    if (!quizId) {
        res.status(400).json({
            message: "Quiz ID is missing in the request parameters.",
        });
        return;
    }

    const user = req.user;

    if (!user || !user.id) {
        res.status(401).json({
            message: "Unauthorized: User not authenticated.",
        });
        return;
    }

    try {
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId,
            },
        });

        if (!quiz) {
            res.status(404).json({
                message: "Quiz not found.",
            });
            return;
        }

        if (quiz.creator_id !== String(user.id)) {
            res.status(403).json({
                message: "Forbidden: You are not the owner of this quiz.",
            });
            return;
        }

        next();
    } catch (err) {
        console.error("Error verifying quiz ownership:", err);
        res.status(500).json({
            message: "Internal server error while verifying quiz ownership.",
        });
        return;
    }
}
