import { ISODateString } from "next-auth";
import { UserType as SessionUserType } from "../../app/api/auth/[...nextauth]/options";

export interface CustomSession {
  user?: SessionUserType;
  expires: ISODateString;
}

export enum Template {
  CLASSIC = 'CLASSIC',
  MODERN = 'MODERN',
  PASTEL = 'PASTEL',
  NEON = 'NEON',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN'
}

export enum QuestionEnumType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER'
}

export enum SessionStatus {
  WAITING = "WAITING",
  STARTING = "STARTING",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
  QUESTION_TRANSITION = "QUESTION_TRANSITION",
  QUESTION_ACTIVE = "QUESTION_ACTIVE",
  QUESTION_ENDED = "QUESTION_ENDED",
}


export interface UserType {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  provider: string;
  createdAt: Date;
  Quiz?: QuizType[];
  LiveSession?: LiveSessionType[];
}

export interface QuizType {
  id: string;
  title: string;
  description?: string | null;
  template: Template;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  isUpdated: boolean;
  defaultTimeLimit: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  creator_id: string;
  creator?: UserType;
  questions?: QuestionType[];
  LiveSession?: LiveSessionType[];
}

export interface QuestionType {
  id: string;
  title: string;
  type: QuestionType;
  points: number;
  options: string[];
  correctAnswer?: number | null;
  timing: number;
  correctBoolean?: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  quiz_id: string;
  quiz?: QuizType;
  QuestionResponse?: QuestionResponseType[];
}

export interface LiveSessionType {
  id: string;
  sessionCode: string;
  status: SessionStatus;
  currentQuestionId?: string | null;
  currentQuestionIndex: number;
  showLeaderboard: boolean;
  allowLateJoin: boolean;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date | null;
  endedAt?: Date | null;
  quizId: string;
  quiz?: QuizType;
  hostId: string;
  host?: UserType;
  participants?: ParticipantType[];
  responses?: QuestionResponseType[];
}

export interface ParticipantType {
  id: string;
  name: string;
  avatar?: string | null;
  isActive: boolean;
  joinedAt: Date;
  leftAt?: Date | null;
  totalScore: number;
  correctCount: number;
  incorrectCount: number;
  sessionId: string;
  session?: LiveSessionType;
  responses?: QuestionResponseType[];
}

export interface QuestionResponseType {
  id: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
  respondedAt: Date;
  sessionId: string;
  session?: LiveSessionType;
  participantId: string;
  participant?: ParticipantType;
  questionId: string;
  question?: QuestionType;
}