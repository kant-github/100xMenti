import { WebSocket } from "ws";

export interface MessageType {
    type: string;
    payload: any;
}

export interface CustomWebSocket extends WebSocket {
    id: string;
    user: HostTokenPayload | ParticipantTokenPayload
}

export enum MESSAGE_TYPES {
    // Connection
    JOIN_QUIZ = 'JOIN_QUIZ',
    LEAVE_QUIZ = 'LEAVE_QUIZ',
    JOINED_QUIZ = 'JOINED_QUIZ',

    // Quiz Management
    QUIZ_CREATED = 'QUIZ_CREATED',
    START_QUIZ = 'START_QUIZ',
    QUIZ_STARTED = 'QUIZ_STARTED',
    NEXT_QUESTION = 'NEXT_QUESTION',
    QUESTION_STARTED = 'QUESTION_STARTED',
    END_QUIZ = 'END_QUIZ',
    QUIZ_ENDED = 'QUIZ_ENDED',

    // Participants
    PARTICIPANT_JOINED = 'PARTICIPANT_JOINED',
    PARTICIPANT_LEFT = 'PARTICIPANT_LEFT',
    PARTICIPANT_LIST = 'PARTICIPANT_LIST',

    // Answers
    SUBMIT_ANSWER = 'SUBMIT_ANSWER',
    ANSWER_RESULT = 'ANSWER_RESULT',
    ANSWER_SUBMITTED = 'ANSWER_SUBMITTED',

    // Leaderboard
    LEADERBOARD_UPDATE = 'LEADERBOARD_UPDATE',

    // System
    ERROR = 'ERROR',
    HEARTBEAT = 'HEARTBEAT',
    SYSTEM_MESSAGE = 'SYSTEM_MESSAGE'
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



interface BaseTokenPayload {
  sessionId: string;
  quizId: string;
  type: 'host' | 'participant';
  iat?: number; // issued at (JWT standard)
  exp?: number; // expiration time (JWT standard)
  iss?: string; // issuer (JWT standard)
  aud?: string; // audience (JWT standard)
}

export interface HostTokenPayload extends BaseTokenPayload {
  type: 'host';
  hostId: string;
  sessionCode: string;
}

export interface ParticipantTokenPayload extends BaseTokenPayload {
  type: 'participant';
  participantId: string;
  name: string;
  avatar: string;
  isActive?: boolean;
  joinedAt?: string;
}