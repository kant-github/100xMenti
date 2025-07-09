/*
  Warnings:

  - You are about to drop the column `currentScreen` on the `live_sessions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "HostScreen" AS ENUM ('LOBBY', 'QUESTION_PREVIEW', 'QUESTION_ACTIVE', 'QUESTION_RESULTS', 'LEADERBOARD', 'FINAL_RESULTS');

-- CreateEnum
CREATE TYPE "ParticipantScreen" AS ENUM ('LOBBY', 'COUNTDOWN', 'QUESTION_ACTIVE', 'QUESTION_RESULTS', 'LEADERBOARD', 'FINAL_RESULTS');

-- AlterTable
ALTER TABLE "live_sessions" DROP COLUMN "currentScreen",
ADD COLUMN     "hostScreen" "HostScreen" NOT NULL DEFAULT 'LOBBY',
ADD COLUMN     "participantScreen" "ParticipantScreen" NOT NULL DEFAULT 'LOBBY';

-- DropEnum
DROP TYPE "CurrentScreen";
