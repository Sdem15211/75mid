import { auth } from "@/auth";
import prisma from "@/lib/db";
import { TaskType } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const date = new Date(searchParams.get("date") || "");
    const userId = searchParams.get("userId");

    if (userId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const day = await prisma.day.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      include: {
        completions: true,
      },
    });

    return Response.json(day);
  } catch (error) {
    console.error("Error in GET /api/days:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date, userId, isRestDay, workouts, tasks } = await request.json();

    if (userId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create or update the day
    const day = await prisma.day.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(date),
        },
      },
      create: {
        userId,
        date: new Date(date),
        isRestDay,
        isComplete: false,
      },
      update: {
        isRestDay,
      },
    });

    // Delete existing completions
    await prisma.taskCompletion.deleteMany({
      where: {
        dayId: day.id,
      },
    });

    // Create new completions
    const completions = [];

    // Add workout completions
    if (workouts.WORKOUT_1.completed) {
      completions.push({
        dayId: day.id,
        taskType: "WORKOUT_1" as TaskType,
        completed: true,
        notes: workouts.WORKOUT_1.description,
      });
    }

    if (workouts.WORKOUT_2.completed) {
      completions.push({
        dayId: day.id,
        taskType: "WORKOUT_2" as TaskType,
        completed: true,
        notes: workouts.WORKOUT_2.description,
      });
    }

    // Add other task completions
    Object.entries(tasks).forEach(([taskType, completed]) => {
      if (completed) {
        completions.push({
          dayId: day.id,
          taskType: taskType as TaskType,
          completed: true,
        });
      }
    });

    await prisma.taskCompletion.createMany({
      data: completions,
    });

    // Fetch and return the updated day with completions
    const updatedDay = await prisma.day.findUnique({
      where: {
        id: day.id,
      },
      include: {
        completions: true,
      },
    });

    return Response.json(updatedDay);
  } catch (error) {
    console.error("Error in POST /api/days:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
