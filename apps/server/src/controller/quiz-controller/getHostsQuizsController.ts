import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export default async function getHostsQuizsController(req: Request, res: Response) {
    const user = req.user;
    if (!user || !user.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const quizzes = await prisma.quiz.findMany({
            where: {
                creator_id: String(user.id)
            },
            include: {
                questions: true,
                _count: {
                    select: {
                        questions: true
                    }
                }
            }
        })

        res.status(200).json({
            data: quizzes,
            message: 'Successfully fetched all the quizzes'
        });
        return;
    } catch (err) {
        console.error("Error in finding quizzes for the creator:", err);
        res.status(500).json({
            message: 'Error in finding quizzes for the creator'
        });
        return;
    }
}