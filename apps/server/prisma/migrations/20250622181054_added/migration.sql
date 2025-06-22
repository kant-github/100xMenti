/*
  Warnings:

  - The values [VIBRANT,MINIMAL] on the enum `Template` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Template_new" AS ENUM ('CLASSIC', 'MODERN', 'PASTEL', 'NEON', 'YELLOW', 'GREEN');
ALTER TABLE "Quiz" ALTER COLUMN "template" DROP DEFAULT;
ALTER TABLE "Quiz" ALTER COLUMN "template" TYPE "Template_new" USING ("template"::text::"Template_new");
ALTER TYPE "Template" RENAME TO "Template_old";
ALTER TYPE "Template_new" RENAME TO "Template";
DROP TYPE "Template_old";
ALTER TABLE "Quiz" ALTER COLUMN "template" SET DEFAULT 'CLASSIC';
COMMIT;
