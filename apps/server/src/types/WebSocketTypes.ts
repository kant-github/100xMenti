import { WebSocket } from "ws";

export interface MessageType {
    type: string;
    payload: any;
}

export interface CustomWebSocket extends WebSocket {
    id: string;
}

export const MESSAGE_TYPES = {
    JOIN_QUIZ: 'JOIN QUIZ',
    LEAVE_QUIZ: 'LEAVE QUIZ',
    ERROR: 'ERROR'
}

export interface QuizRoom {
    sessionId: string;
    sessionCode: string;
    hostId: string;
    quizId: string;
    participants: Map<string, ParticipantData>;
    currentQuestionIndex: number;
    currentQuestionId: string | null;
    status: 'WAITING' | 'STARTING' | 'IN_PROGRESS' | 'PAUSED' | 'FINISHED' | 'CANCELLED';
    questionStartTime: number | null;
}

export interface ParticipantData {
    id: string;
    name: string;
    avatar?: string;
    socketId: string;
    totalScore: number;
    correctCount: number;
    incorrectCount: number;
    isActive: boolean;
    joinedAt: Date;
}
