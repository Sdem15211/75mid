import { addDays, isBefore, isAfter, startOfDay } from "date-fns";

// Create the start date in UTC to match database storage
export const CHALLENGE_START_DATE = new Date(Date.UTC(2025, 1, 3)); // February 3rd, 2025 00:00 UTC
export const CHALLENGE_END_DATE = addDays(CHALLENGE_START_DATE, 74); // 75 days total
export const CHALLENGE_DURATION_DAYS = 75;

// Helper function to normalize a date to UTC midnight
export function normalizeToUTCDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function isWithinChallengePeriod(date: Date): boolean {
  const normalizedDate = normalizeToUTCDay(date);
  const normalizedStart = normalizeToUTCDay(CHALLENGE_START_DATE);
  const normalizedEnd = normalizeToUTCDay(CHALLENGE_END_DATE);

  return (
    !isBefore(normalizedDate, normalizedStart) &&
    !isAfter(normalizedDate, normalizedEnd)
  );
}

export function getDayNumber(date: Date): number | null {
  if (!isWithinChallengePeriod(date)) return null;

  const normalizedDate = normalizeToUTCDay(date);
  const normalizedStartDate = normalizeToUTCDay(CHALLENGE_START_DATE);

  const diffTime = normalizedDate.getTime() - normalizedStartDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1; // Adding 1 to make it 1-based instead of 0-based
}

export function getDateFromDayNumber(dayNumber: number): Date | null {
  if (dayNumber < 1 || dayNumber > CHALLENGE_DURATION_DAYS) return null;

  return addDays(CHALLENGE_START_DATE, dayNumber - 1);
}

export type TaskType =
  | "WORKOUT_1"
  | "WORKOUT_2"
  | "WATER_INTAKE"
  | "READING"
  | "HEALTHY_DIET"
  | "SLEEP_GOAL"
  | "PROGRESS_PHOTO";

export const TASK_LABELS: Record<TaskType, string> = {
  WORKOUT_1: "Eerste Workout",
  WORKOUT_2: "Tweede Workout",
  WATER_INTAKE: "Drink 3 liter water",
  READING: "Lees 10 pagina's in non-fictie",
  HEALTHY_DIET: "Eet gezond",
  SLEEP_GOAL: "8 uur slaap",
  PROGRESS_PHOTO: "Progress foto genomen",
};
