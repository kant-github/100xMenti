import { Request, Response } from "express";
import generateRandom6digitCode from "../../lib/generateRandom6digitCode";
import { prisma } from "../../lib/prisma";
import { SessionStatus, HostScreen, ParticipantScreen } from "@prisma/client";
import jwt from 'jsonwebtoken';

export default async function launchQuizController(req: Request, res: Response) {
    const user = req.user;
    if (!user || !user.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    const { quizId } = req.params;
    if (!quizId) {
        res.status(400).json({
            success: false,
            message: "Quiz ID is required"
        });
        return;
    }

    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: true
            }
        })

        if (!quiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
            return;
        }

        if (!quiz.isPublished) {
            res.status(200).json({
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

        // Check for existing active sessions using new enum structure
        const existingSession = await prisma.liveSession.findFirst({
            where: {
                quizId: quizId,
                status: {
                    in: [SessionStatus.PENDING, SessionStatus.LIVE, SessionStatus.PAUSED]
                }
            }
        });

        if (existingSession) {
            res.status(200).json({
                success: false,
                message: "Quiz already has an active session",
                sessionCode: existingSession.sessionCode
            });
            return;
        }

        const getNewSessionCode = await generateRandom6digitCode();
        const liveSession = await prisma.liveSession.create({
            data: {
                sessionCode: getNewSessionCode,
                status: SessionStatus.PENDING,
                hostScreen: HostScreen.LOBBY,
                participantScreen: ParticipantScreen.LOBBY,
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

        const hostTokenPayload = {
            hostId: user.id,
            sessionId: liveSession.id,
            quizId: quiz.id,
            type: 'host',
            sessionCode: liveSession.sessionCode
        };

        const hostToken = jwt.sign(hostTokenPayload, JWT_SECRET, {
            expiresIn: '2h',
            issuer: 'quiz-app',
            audience: 'quiz-host'
        });

        res.status(201).json({
            success: true,
            message: "Quiz launched successfully",
            data: {
                sessionId: liveSession.id,
                sessionCode: liveSession.sessionCode,
                status: liveSession.status,
                hostScreen: liveSession.hostScreen,
                participantScreen: liveSession.participantScreen,
                quiz: liveSession.quiz,
                createdAt: liveSession.createdAt,
                hostToken: hostToken
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