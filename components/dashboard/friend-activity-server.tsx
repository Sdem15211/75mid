import { FriendActivity } from "./friend-activity";
import prisma from "@/lib/db";
import { normalizeToUTCDay } from "@/lib/challenge-utils";

interface UserDayData {
  id: string;
  name: string | null;
  image: string | null;
  day: {
    isRestDay: boolean;
    isComplete: boolean;
    completions: {
      taskType: string;
      completed: boolean;
      notes?: string | null;
    }[];
  } | null;
}

async function getAllUsersProgress(): Promise<UserDayData[]> {
  const now = new Date();
  const todayStart = normalizeToUTCDay(now);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

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

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    image: user.image,
    day: user.days[0] ?? null,
  }));
}

export async function FriendActivityServer() {
  const initialUsersData = await getAllUsersProgress();

  return <FriendActivity initialUsersData={initialUsersData} />;
}
