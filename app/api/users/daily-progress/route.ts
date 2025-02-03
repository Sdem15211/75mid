import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { startOfDay } from "date-fns";

export async function GET() {
  try {
    const today = startOfDay(new Date());

    // Get all users with their day data for today
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        days: {
          where: {
            date: today,
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
