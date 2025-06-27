import { Request, Response } from "express";
import generateRandom6digitCode from "../../lib/generateRandom6digitCode";
import { prisma } from "../../lib/prisma";

export default async function launchQuizController(req: Request, res: Response) {
    const user = req.user;
    if (!user || !user.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { quizId } = req.params;
    if (!quizId) {
        res.status(400).json({
            success: false,
            message: "Quiz ID is required"
        });
        return;
    }

    try {
        //first check if the request for which the quizId should be lauched exists or not ?

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: true
            }
        })

        console.log("quiz is : ", quiz);

        if (!quiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
            return;
        }

        if (!quiz.isPublished) {
            res.status(400).json({
                success: false,
                message: "Quiz must be published before launching"
            });
            return;
        }

        if (!quiz.questions || quiz.questions.length === 0) {
            res.status(400).json({
                success: false,
                message: "Quiz must have at least one question"
            });
            return;
        }

        const existingSession = await prisma.liveSession.findFirst({
            where: {
                quizId: quizId,
                status: {
                    in: ['WAITING', 'STARTING', 'IN_PROGRESS', 'PAUSED']
                }
            }
        });

        console.log("existing session is : ", existingSession);

        if (existingSession) {
            res.status(409).json({
                success: false,
                message: "Quiz already has an active session",
                sessionCode: existingSession.sessionCode
            });
            return;
        }

        const getNewSessionCode = await generateRandom6digitCode();
        console.log("new session code is : ", getNewSessionCode);
        const liveSession = await prisma.liveSession.create({
            data: {
                sessionCode: getNewSessionCode,
                status: 'WAITING',
                currentQuestionId: quiz.questions[0].id,
                currentQuestionIndex: 0,
                showLeaderboard: true,
                allowLateJoin: true,
                startedAt: new Date(),
                quizId: quiz.id,
                hostId: String(user.id),
            },
            include: {
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        template: true,
                        defaultTimeLimit: true,
                        shuffleQuestions: true,
                        shuffleOptions: true,
                        showCorrectAnswers: true
                    }
                }
            }
        })

        console.log("live session created is : ", liveSession);
        res.status(201).json({
            success: true,
            message: "Quiz launched successfully",
            data: {
                sessionId: liveSession.id,
                sessionCode: liveSession.sessionCode,
                status: liveSession.status,
                quiz: liveSession.quiz,
                createdAt: liveSession.createdAt
            }
        });
        return;

    } catch (err) {
        console.error('Error launching quiz:', err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to launch quiz"
        });
    }
}