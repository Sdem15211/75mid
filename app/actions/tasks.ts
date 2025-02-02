import { auth } from "@/auth";
import { TaskType, isWithinChallengePeriod } from "@/lib/challenge-utils";
import { revalidatePath } from "next/cache";
import { TaskCompletion } from "@prisma/client";
import prisma from "@/lib/db";

export async function toggleTask(date: Date, taskType: TaskType) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  if (!isWithinChallengePeriod(date)) {
    throw new Error("Date is outside the challenge period");
  }

  // Get or create the day entry
  const day = await prisma.day.upsert({
    where: {
      userId_date: {
        userId: session.user.id,
        date,
      },
    },
    create: {
      userId: session.user.id,
      date,
      isComplete: false,
      isRestDay: false,
    },
    include: {
      completions: true,
    },
    update: {},
  });

  // Get or toggle the task completion
  const existingCompletion = day.completions.find(
    (completion: TaskCompletion) => completion.taskType === taskType
  );

  if (existingCompletion) {
    await prisma.taskCompletion.update({
      where: { id: existingCompletion.id },
      data: { completed: !existingCompletion.completed },
    });
  } else {
    await prisma.taskCompletion.create({
      data: {
        dayId: day.id,
        taskType,
        completed: true,
      },
    });
  }

  // Check if all tasks are complete and update the day status
  const updatedCompletions = await prisma.taskCompletion.findMany({
    where: { dayId: day.id },
  });

  const allTasksComplete = updatedCompletions.every(
    (completion: TaskCompletion) => completion.completed
  );

  if (allTasksComplete !== day.isComplete) {
    await prisma.day.update({
      where: { id: day.id },
      data: { isComplete: allTasksComplete },
    });
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleRestDay(date: Date) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  if (!isWithinChallengePeriod(date)) {
    throw new Error("Date is outside the challenge period");
  }

  const day = await prisma.day.upsert({
    where: {
      userId_date: {
        userId: session.user.id,
        date,
      },
    },
    create: {
      userId: session.user.id,
      date,
      isComplete: false,
      isRestDay: true,
    },
    update: {
      isRestDay: {
        set: true,
      },
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getDayStatus(date: Date) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const day = await prisma.day.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date,
      },
    },
    include: {
      completions: true,
    },
  });

  return day;
}
