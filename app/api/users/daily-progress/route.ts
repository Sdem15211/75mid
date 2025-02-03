import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeToUTCDay } from "@/lib/challenge-utils";

export async function GET() {
  try {
    const now = new Date();
    // Convert to UTC day boundaries
    const todayStart = normalizeToUTCDay(now);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

    console.log("Date range for query:", {
      now: now.toISOString(),
      todayStart: todayStart.toISOString(),
      tomorrowStart: tomorrowStart.toISOString(),
      userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // Get all users with their day data for today using a date range
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        days: {
          where: {
            date: {
              gte: todayStart,
              lt: tomorrowStart,
            },
          },
          select: {
            id: true,
            date: true,
            isRestDay: true,
            isComplete: true,
            completions: {
              select: {
                taskType: true,
                completed: true,
                notes: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
          take: 1,
        },
      },
    });

    // Transform the data to match the expected format
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      image: user.image,
      day: user.days[0] ?? null,
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error("Error fetching users progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch users progress" },
      { status: 500 }
    );
  }
}
