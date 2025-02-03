import { Day, TaskCompletion } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { startOfDay } from "date-fns";

export type DayData = Day & { completions: TaskCompletion[] };

type WorkoutData = {
  completed: boolean;
  description: string;
};

type OtherTaskType = "WATER_INTAKE" | "READING" | "HEALTHY_DIET" | "SLEEP_GOAL";

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
    `/api/days?date=${startOfDay(date).toISOString()}&userId=${userId}`
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
  const response = await fetch("/api/days", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: startOfDay(data.date).toISOString(),
      userId: data.userId,
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
    queryKey: ["day", startOfDay(date).toISOString(), userId],
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
        ["day", startOfDay(variables.date).toISOString(), variables.userId],
        data
      );
    },
  });
}

export function transformDayDataToFormData(dayData: DayData | null): FormData {
  if (!dayData) {
    return {
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
      },
    };
  }

  return {
    isRestDay: dayData.isRestDay,
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
    },
  };
}
