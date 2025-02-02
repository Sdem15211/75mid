/*
  Warnings:

  - The values [NO_ALCOHOL] on the enum `TaskType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `challengeId` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the `Challenge` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,date]` on the table `Day` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Day` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskType_new" AS ENUM ('WORKOUT_1', 'WORKOUT_2', 'WATER_INTAKE', 'READING', 'HEALTHY_DIET', 'SLEEP_GOAL');
ALTER TABLE "TaskCompletion" ALTER COLUMN "taskType" TYPE "TaskType_new" USING ("taskType"::text::"TaskType_new");
ALTER TYPE "TaskType" RENAME TO "TaskType_old";
ALTER TYPE "TaskType_new" RENAME TO "TaskType";
DROP TYPE "TaskType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_userId_fkey";

-- DropForeignKey
ALTER TABLE "Day" DROP CONSTRAINT "Day_challengeId_fkey";

-- DropIndex
DROP INDEX "Day_challengeId_date_key";

-- DropIndex
DROP INDEX "Day_challengeId_idx";

-- AlterTable
ALTER TABLE "Day" DROP COLUMN "challengeId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Challenge";

-- CreateIndex
CREATE INDEX "Day_userId_idx" ON "Day"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Day_userId_date_key" ON "Day"("userId", "date");

-- AddForeignKey
ALTER TABLE "Day" ADD CONSTRAINT "Day_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
