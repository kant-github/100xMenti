import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export default async function getQuizController(req: Request, res: Response) {
    try {
        const user = req.user;

        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { quizId } = req.params;
        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            },
            include: {
                questions: true
            }
        });

        res.status(201).json({
            data: quiz
        });
        return
    } catch (err) {
        console.error("Error creating quiz:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}
