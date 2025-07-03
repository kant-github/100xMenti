import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export default async function publishQuizController(req: Request, res: Response) {
    const user = req.user;

    if (!user || !user.id) {
        res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
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
        // Get quiz with questions to validate everything at once
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        // Check if quiz exists
        if (!quiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
            return;
        }

        if (quiz.isPublished) {
            res.status(400).json({
                success: false,
                message: "Quiz is already published"
            });
            return;
        }

        const validationErrors = validateQuizForPublishing(quiz);

        if (validationErrors.length > 0) {
            res.status(400).json({
                success: false,
                message: "Quiz validation failed",
                errors: validationErrors
            });
            return;
        }

        const publishedQuiz = await prisma.quiz.update({
            where: { id: quizId },
            data: {
                isPublished: true,
                updatedAt: new Date(),
                isUpdated: false
            },
            include: {
                questions: true,
                _count: {
                    select: {
                        questions: true
                    }
                }
            }
        });

        const stats = calculateQuizStats(publishedQuiz.questions);

        res.status(200).json({
            success: true,
            message: "Quiz published successfully!",
            data: {
                id: publishedQuiz.id,
                title: publishedQuiz.title,
                description: publishedQuiz.description,
                isPublished: publishedQuiz.isPublished,
                publishedAt: publishedQuiz.updatedAt,
                stats: stats
            }
        });
        return;

    } catch (error: any) {
        console.error('Error publishing quiz:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to publish quiz"
        });
    }
}

function validateQuizForPublishing(quiz: any): string[] {
    const errors: string[] = [];

    if (!quiz.title?.trim()) {
        errors.push("Quiz must have a title");
    }

    if (quiz.title?.length > 100) {
        errors.push("Quiz title must be less than 100 characters");
    }

    if (!quiz.questions || quiz.questions.length === 0) {
        errors.push("Quiz must have at least one question");
    }

    if (quiz.questions?.length > 50) {
        errors.push("Quiz cannot have more than 50 questions");
    }

    quiz.questions?.forEach((question: any, index: number) => {
        const questionNum = index + 1;

        if (!question.title?.trim()) {
            errors.push(`Question ${questionNum}: Must have a title`);
        }

        if (question.type === 'MULTIPLE_CHOICE') {
            if (!question.options || question.options.length < 2) {
                errors.push(`Question ${questionNum}: Must have at least 2 options`);
            }

            if (question.options?.length > 6) {
                errors.push(`Question ${questionNum}: Cannot have more than 6 options`);
            }

            const emptyOptions = question.options?.filter((opt: string) => !opt?.trim()).length;
            if (emptyOptions > 0) {
                errors.push(`Question ${questionNum}: All options must have text`);
            }

            if (question.correctAnswer === null || question.correctAnswer === undefined) {
                errors.push(`Question ${questionNum}: Must have a correct answer selected`);
            } else if (question.correctAnswer < 0 || question.correctAnswer >= question.options?.length) {
                errors.push(`Question ${questionNum}: Correct answer index is invalid`);
            }
        }

        if (question.type === 'TRUE_FALSE') {
            if (question.correctBoolean === null || question.correctBoolean === undefined) {
                errors.push(`Question ${questionNum}: Must have a correct boolean answer`);
            }
        }

        if (!question.points || question.points < 1) {
            errors.push(`Question ${questionNum}: Must have points assigned (minimum 1)`);
        }

        if (question.points > 1000) {
            errors.push(`Question ${questionNum}: Points cannot exceed 1000`);
        }

        if (!question.timing || question.timing < 5) {
            errors.push(`Question ${questionNum}: Must have a time limit (minimum 5 seconds)`);
        }

        if (question.timing > 300) {
            errors.push(`Question ${questionNum}: Time limit cannot exceed 5 minutes`);
        }
    });

    return errors;
}

function calculateQuizStats(questions: any[]) {
    const questionTypes = questions.reduce((acc, q) => {
        acc[q.type] = (acc[q.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const totalTime = questions.reduce((sum, q) => sum + q.timing, 0);
    const averageTime = Math.round(totalTime / questions.length);
    const estimatedDuration = Math.ceil(totalTime / 60); // in minutes

    return {
        totalQuestions: questions.length,
        totalPoints: totalPoints,
        totalTimeSeconds: totalTime,
        averageTimePerQuestion: averageTime,
        estimatedDuration: estimatedDuration,
        questionTypes: questionTypes
    };
}