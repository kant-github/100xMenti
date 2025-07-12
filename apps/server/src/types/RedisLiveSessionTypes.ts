import { HostScreen, ParticipantScreen, SessionStatus } from "@prisma/client";

export interface LiveSessionCache {
    sessionId: string;
    sessionCode: string;
    hostId: string;
    quizId: string;
    currentQuestionIndex: number;
    currentQuestionId?: string | null;
    status: SessionStatus;
    hostScreen: HostScreen;
    participantScreen: ParticipantScreen;
    allowLateJoin: boolean,
    questionStartTime?: Date | null;
    participants?: Map<string, ParticipantDataCache>;
    createdAt?: Date;

    questionData: any;
    questionEndTime: Date | null;
    readingPhaseEndTime: Date | null;
}

// Redis cache type for participant data
// This includes socketId which is Redis-specific and not in Prisma
export interface ParticipantDataCache {
    id: string;
    name: string;
    avatar?: string | null; // Optional to match Prisma schema
    socketId: string; // Redis-specific field for WebSocket management
    sessionId: string;
    isActive: boolean;
    joinedAt: Date;
    leftAt?: Date | null; // Optional since participants might not have left
    totalScore: number;
    correctCount: number;
    incorrectCount: number;
}

// Type for score update operations
export interface ScoreUpdateData {
    totalScore: number;
    correctCount: number;
    incorrectCount: number;
}

// Type for the data returned from Redis (before parsing)
export interface RawRedisSessionData {
    sessionId?: string;
    sessionCode: string;
    hostId: string;
    quizId: string;
    currentQuestionIndex: string; // Redis stores as string
    currentQuestionId?: string;
    status: string; // Redis stores as string
    questionStartTime?: string; // Redis stores as string
    createdAt?: string; // Redis stores as string
}

// Helper type for creating a new session (without computed fields)
export interface CreateSessionData {
    sessionCode: string;
    hostId: string;
    quizId: string;
    currentQuestionIndex: number;
    currentQuestionId?: string;
    status: SessionStatus;
    questionStartTime?: Date;
}

// Helper type for participant creation (without computed fields)
export interface CreateParticipantData {
    id: string;
    name: string;
    avatar?: string;
    socketId: string;
    sessionId: string;
    isActive?: boolean;
    joinedAt?: Date;
    totalScore?: number;
    correctCount?: number;
    incorrectCount?: number;
}