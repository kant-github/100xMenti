/*
  Warnings:

  - The values [WAITING,STARTING,IN_PROGRESS,FINISHED,QUESTION_TRANSITION,QUESTION_ACTIVE,QUESTION_ENDED] on the enum `SessionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "CurrentScreen" AS ENUM ('LOBBY', 'COUNTDOWN', 'QUESTION_ACTIVE', 'QUESTION_RESULTS', 'LEADERBOARD', 'FINAL_RESULTS');

-- AlterEnum
BEGIN;
CREATE TYPE "SessionStatus_new" AS ENUM ('PENDING', 'LIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');
ALTER TABLE "live_sessions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "live_sessions" ALTER COLUMN "status" TYPE "SessionStatus_new" USING ("status"::text::"SessionStatus_new");
ALTER TYPE "SessionStatus" RENAME TO "SessionStatus_old";
ALTER TYPE "SessionStatus_new" RENAME TO "SessionStatus";
DROP TYPE "SessionStatus_old";
ALTER TABLE "live_sessions" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "live_sessions" ADD COLUMN     "currentScreen" "CurrentScreen" NOT NULL DEFAULT 'LOBBY',
ALTER COLUMN "status" SET DEFAULT 'PENDING';
