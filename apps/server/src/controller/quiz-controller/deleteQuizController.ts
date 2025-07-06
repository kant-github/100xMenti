import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export default async function deleteQuizController(req: Request, res: Response) {
    const user = req.user;

    if (!user || !user.id) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }

    const { quizId } = req.params;

    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                LiveSession: true,
            },
        });

        if (!quiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found",
                quizId,
            });
            return;
        }

        const inProgressSession = quiz.LiveSession.find(
            (session) => session.status === "IN_PROGRESS"
        );

        if (inProgressSession) {
            res.status(400).json({
                success: false,
                message: "Cannot delete quiz: A live session is currently in progress",
                quizId,
                liveSessionId: inProgressSession.id,
                sessionStatus: inProgressSession.status,
            });
            return;
        }

        await prisma.quiz.delete({
            where: { id: quizId },
        });

        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully",
            quizId,
        });
        return;
    } catch (err) {
        console.error("Error deleting quiz:", err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: (err as Error).message,
        });
        return;
    }
}
