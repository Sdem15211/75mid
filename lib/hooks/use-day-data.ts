import { Day, TaskCompletion } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeToUTCDay } from "@/lib/challenge-utils";

export type DayData = (Day & { completions: TaskCompletion[] }) & {
  restDaysLeft?: number;
  error?: string;
};

type WorkoutData = {
  completed: boolean;
  description: string;
};

type OtherTaskType =
  | "WATER_INTAKE"
  | "READING"
  | "HEALTHY_DIET"
  | "SLEEP_GOAL"
  | "PROGRESS_PHOTO";

export type FormData = {
  isRestDay: boolean;
  workouts: {
    WORKOUT_1: WorkoutData;
    WORKOUT_2: WorkoutData;
  };
  tasks: Record<OtherTaskType, boolean>;
};

async function fetchDayData(
  date: Date,
  userId: string
): Promise<DayData | null> {
  const response = await fetch(
    `/api/days/${userId}?date=${normalizeToUTCDay(date).toISOString()}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch day data");
  }
  return response.json();
}

async function updateDayData(data: {
  date: Date;
  userId: string;
  formData: FormData;
}): Promise<DayData> {
  const response = await fetch(`/api/days/${data.userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: normalizeToUTCDay(data.date).toISOString(),
      ...data.formData,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update day data");
  }

  return response.json();
}

export function useDayData(date: Date, userId: string) {
  return useQuery({
    queryKey: ["day", normalizeToUTCDay(date).toISOString(), userId],
    queryFn: () => fetchDayData(date, userId),
    enabled: !!userId,
  });
}

export function useUpdateDayData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDayData,
    onSuccess: (data, variables) => {
      // Update the query cache with the new data
      queryClient.setQueryData(
        [
          "day",
          normalizeToUTCDay(variables.date).toISOString(),
          variables.userId,
        ],
        data
      );
    },
  });
}

export function transformDayDataToFormData(dayData: DayData | null): FormData {
  const defaultFormData: FormData = {
    isRestDay: false,
    workouts: {
      WORKOUT_1: { completed: false, description: "" },
      WORKOUT_2: { completed: false, description: "" },
    },
    tasks: {
      WATER_INTAKE: false,
      READING: false,
      HEALTHY_DIET: false,
      SLEEP_GOAL: false,
      PROGRESS_PHOTO: false,
    },
  };

  if (!dayData || !dayData.completions) {
    return defaultFormData;
  }

  return {
    isRestDay: dayData.isRestDay ?? false,
    workouts: {
      WORKOUT_1: {
        completed: dayData.completions.some(
          (c) => c.taskType === "WORKOUT_1" && c.completed
        ),
        description:
          dayData.completions.find((c) => c.taskType === "WORKOUT_1")?.notes ??
          "",
      },
      WORKOUT_2: {
        completed: dayData.completions.some(
          (c) => c.taskType === "WORKOUT_2" && c.completed
        ),
        description:
          dayData.completions.find((c) => c.taskType === "WORKOUT_2")?.notes ??
          "",
      },
    },
    tasks: {
      WATER_INTAKE: dayData.completions.some(
        (c) => c.taskType === "WATER_INTAKE" && c.completed
      ),
      READING: dayData.completions.some(
        (c) => c.taskType === "READING" && c.completed
      ),
      HEALTHY_DIET: dayData.completions.some(
        (c) => c.taskType === "HEALTHY_DIET" && c.completed
      ),
      SLEEP_GOAL: dayData.completions.some(
        (c) => c.taskType === "SLEEP_GOAL" && c.completed
      ),
      PROGRESS_PHOTO: dayData.completions.some(
        (c) => c.taskType === "PROGRESS_PHOTO" && c.completed
      ),
    },
  };
}
