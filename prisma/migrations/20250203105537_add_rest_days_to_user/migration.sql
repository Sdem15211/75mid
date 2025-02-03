-- AlterEnum
ALTER TYPE "TaskType" ADD VALUE 'NO_ALCOHOL';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "restDaysLeft" INTEGER NOT NULL DEFAULT 11;

-- Update existing users
UPDATE "User" SET "restDaysLeft" = 11;
