import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export default async function createQuizController(req: Request, res: Response) {
    try {
        const {
            title,
            template,
            timing,
            questions,
            newQuizId
        } = req.body;

        const user = req.user;
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const result = await prisma.$transaction(async (tx) => {
            
            const existingQuiz = await tx.quiz.findUnique({
                where: { id: newQuizId }
            });

            const isUpdate = !!existingQuiz;
            const now = new Date();

            if (isUpdate) {
                // Delete existing questions first
                await tx.question.deleteMany({
                    where: { quiz_id: newQuizId }
                });

                // Update quiz and create new questions
                const updatedQuiz = await tx.quiz.update({
                    where: { id: newQuizId },
                    data: {
                        title,
                        template: template.toUpperCase(),
                        defaultTimeLimit: timing,
                        updatedAt: now,
                        isUpdated: true,
                        questions: {
                            create: questions.map((q: any) => ({
                                title: q.question,
                                correctAnswer: q.correctAnswer,
                                points: 1,
                                options: q.options,
                                timing: q.timing
                            }))
                        }
                    },
                    include: {
                        questions: true
                    }
                });

                return { quiz: updatedQuiz, isUpdate: true };
            } else {
                // Create new quiz
                const newQuiz = await tx.quiz.create({
                    data: {
                        id: newQuizId,
                        title,
                        template: template.toUpperCase(),
                        defaultTimeLimit: timing,
                        creator_id: String(user.id),
                        createdAt: now,
                        updatedAt: now,
                        isUpdated: false,
                        questions: {
                            create: questions.map((q: any) => ({
                                title: q.question,
                                correctAnswer: q.correctAnswer,
                                points: 1,
                                options: q.options,
                                timing: q.timing
                            }))
                        }
                    },
                    include: {
                        questions: true
                    }
                });

                return { quiz: newQuiz, isUpdate: false };
            }
        });

        res.status(result.isUpdate ? 200 : 201).json({
            data: result.quiz,
            isUpdate: result.isUpdate
        });
        return;

    } catch (err) {
        console.error("Error creating/updating quiz:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}