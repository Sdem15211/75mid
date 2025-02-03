import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";

export async function GET() {
  try {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    console.log("Fetching daily progress:", {
      rawDate: now.toISOString(),
      todayStart: todayStart.toISOString(),
      todayEnd: todayEnd.toISOString(),
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
              lte: todayEnd,
            },
          },
          select: {
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

    // Log the raw data for debugging
    console.log("Users data:", JSON.stringify(users, null, 2));

    // Transform the data to match the expected format
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      image: user.image,
      day: user.days[0] ?? null,
    }));

    // Log the transformed data
    console.log(
      "Transformed users data:",
      JSON.stringify(transformedUsers, null, 2)
    );

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error("Error fetching users progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch users progress" },
      { status: 500 }
    );
  }
}
