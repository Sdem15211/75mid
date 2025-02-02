-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('WORKOUT_1', 'WORKOUT_2', 'WATER_INTAKE', 'READING', 'HEALTHY_DIET', 'NO_ALCOHOL', 'SLEEP_GOAL');

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "restDaysLeft" INTEGER NOT NULL DEFAULT 11,
    "completedDays" INTEGER NOT NULL DEFAULT 0,
    "completionPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Day" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "challengeId" TEXT NOT NULL,
    "isRestDay" BOOLEAN NOT NULL DEFAULT false,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskCompletion" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "taskType" "TaskType" NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Challenge_userId_idx" ON "Challenge"("userId");

-- CreateIndex
CREATE INDEX "Day_challengeId_idx" ON "Day"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "Day_challengeId_date_key" ON "Day"("challengeId", "date");

-- CreateIndex
CREATE INDEX "TaskCompletion_dayId_idx" ON "TaskCompletion"("dayId");

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Day" ADD CONSTRAINT "Day_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCompletion" ADD CONSTRAINT "TaskCompletion_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
