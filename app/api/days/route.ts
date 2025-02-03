import { auth } from "@/lib/auth";
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

    // Get both the day data and user data
    const [day, user] = await Promise.all([
      prisma.day.findUnique({
        where: {
          userId_date: {
            userId,
            date,
          },
        },
        include: {
          completions: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { restDaysLeft: true },
      }),
    ]);

    // If there's no day data, return a properly structured null response
    if (!day) {
      return Response.json({
        id: null,
        date: null,
        userId: null,
        isRestDay: false,
        isComplete: false,
        completions: [],
        restDaysLeft: user?.restDaysLeft,
      });
    }

    return Response.json({
      ...day,
      restDaysLeft: user?.restDaysLeft,
    });
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

    // Get the current day to check if it was already a rest day
    const existingDay = await prisma.day.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(date),
        },
      },
    });

    // Get user to check rest days left
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Check if trying to use a rest day when none are left
    if (isRestDay && !existingDay?.isRestDay && user.restDaysLeft <= 0) {
      return Response.json(
        { error: "No rest days left to use" },
        { status: 400 }
      );
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

    // Update rest days count if needed
    if (isRestDay !== existingDay?.isRestDay) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          restDaysLeft: {
            // Increment if removing rest day, decrement if adding rest day
            [isRestDay ? "decrement" : "increment"]: 1,
          },
        },
      });
    }

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

    // Fetch and return the updated day with completions and rest days left
    const updatedDay = await prisma.day.findUnique({
      where: {
        id: day.id,
      },
      include: {
        completions: true,
      },
    });

    // Get updated user for rest days count
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { restDaysLeft: true },
    });

    return Response.json({
      ...updatedDay,
      restDaysLeft: updatedUser?.restDaysLeft,
    });
  } catch (error) {
    console.error("Error in POST /api/days:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
