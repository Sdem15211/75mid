import { DayData } from "@/lib/hooks/use-day-data";
import { DailyChecklist } from "./daily-checklist";
import prisma from "@/lib/db";
import { normalizeToUTCDay } from "@/lib/challenge-utils";

interface DailyChecklistServerProps {
  initialDate: Date;
  userId: string;
}

async function getDayData(date: Date, userId: string): Promise<DayData | null> {
  const [day, user] = await Promise.all([
    prisma.day.findUnique({
      where: {
        userId_date: {
          userId,
          date: normalizeToUTCDay(date),
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

  if (!day) {
    // Return null to indicate no data exists yet
    return null;
  }

  return {
    ...day,
    restDaysLeft: user?.restDaysLeft,
  };
}

export async function DailyChecklistServer({
  initialDate,
  userId,
}: DailyChecklistServerProps) {
  const initialDayData = await getDayData(initialDate, userId);

  return (
    <DailyChecklist
      initialDate={initialDate}
      userId={userId}
      initialDayData={initialDayData}
    />
  );
}
