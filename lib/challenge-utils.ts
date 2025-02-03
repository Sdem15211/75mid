import { addDays, isBefore, isAfter, startOfDay } from "date-fns";

export const CHALLENGE_START_DATE = new Date(2025, 1, 3); // February 3rd, 2025
export const CHALLENGE_END_DATE = addDays(CHALLENGE_START_DATE, 74); // 75 days total
export const CHALLENGE_DURATION_DAYS = 75;

export function isWithinChallengePeriod(date: Date): boolean {
  const normalizedDate = startOfDay(date);
  return (
    !isBefore(normalizedDate, startOfDay(CHALLENGE_START_DATE)) &&
    !isAfter(normalizedDate, startOfDay(CHALLENGE_END_DATE))
  );
}

export function getDayNumber(date: Date): number | null {
  if (!isWithinChallengePeriod(date)) return null;

  const normalizedDate = startOfDay(date);
  const normalizedStartDate = startOfDay(CHALLENGE_START_DATE);

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
