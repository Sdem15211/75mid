"use client";
import { useState } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TaskType, TASK_LABELS } from "@/lib/challenge-utils";

interface DailyChecklistProps {
  currentDay: number;
}

type WorkoutData = {
  completed: boolean;
  description: string;
};

type OtherTaskType = "WATER_INTAKE" | "READING" | "HEALTHY_DIET" | "SLEEP_GOAL";

type FormData = {
  isRestDay: boolean;
  workouts: {
    WORKOUT_1: WorkoutData;
    WORKOUT_2: WorkoutData;
  };
  tasks: Record<OtherTaskType, boolean>;
};

export function DailyChecklist({ currentDay }: DailyChecklistProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<FormData>({
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
  };

  const isToday = isSameDay(date, new Date());

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dag {currentDay}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => setDate(subDays(date, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[180px] text-center">
              {format(date, "EEEE d MMMM")}
              {isToday && " (vandaag)"}
            </span>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => setDate(addDays(date, 1))}
              disabled={isToday}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!formData.isRestDay ? (
          <div className="space-y-6">
            {/* Workout tasks */}
            <Card className="overflow-hidden border rounded-lg">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Workout 1 */}
                  <div className="flex items-start gap-4">
                    <Checkbox
                      id="WORKOUT_1"
                      checked={formData.workouts.WORKOUT_1.completed}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          workouts: {
                            ...prev.workouts,
                            WORKOUT_1: {
                              ...prev.workouts.WORKOUT_1,
                              completed: checked as boolean,
                            },
                          },
                        }))
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="WORKOUT_1"
                        className="text-base font-medium"
                      >
                        {TASK_LABELS.WORKOUT_1}
                      </Label>
                      <Textarea
                        placeholder="Beschrijf je workout..."
                        value={formData.workouts.WORKOUT_1.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            workouts: {
                              ...prev.workouts,
                              WORKOUT_1: {
                                ...prev.workouts.WORKOUT_1,
                                description: e.target.value,
                              },
                            },
                          }))
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Workout 2 */}
                  <div className="flex items-start gap-4">
                    <Checkbox
                      id="WORKOUT_2"
                      checked={formData.workouts.WORKOUT_2.completed}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          workouts: {
                            ...prev.workouts,
                            WORKOUT_2: {
                              ...prev.workouts.WORKOUT_2,
                              completed: checked as boolean,
                            },
                          },
                        }))
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="WORKOUT_2"
                        className="text-base font-medium"
                      >
                        {TASK_LABELS.WORKOUT_2}
                      </Label>
                      <Textarea
                        placeholder="Beschrijf je workout..."
                        value={formData.workouts.WORKOUT_2.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            workouts: {
                              ...prev.workouts,
                              WORKOUT_2: {
                                ...prev.workouts.WORKOUT_2,
                                description: e.target.value,
                              },
                            },
                          }))
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Other tasks */}
            <Card className="overflow-hidden border rounded-lg divide-y">
              {(
                [
                  "WATER_INTAKE",
                  "READING",
                  "HEALTHY_DIET",
                  "SLEEP_GOAL",
                ] as OtherTaskType[]
              ).map((taskType) => (
                <div
                  key={taskType}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      id={taskType}
                      checked={formData.tasks[taskType]}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          tasks: {
                            ...prev.tasks,
                            [taskType]: checked as boolean,
                          },
                        }))
                      }
                    />
                    <Label htmlFor={taskType} className="text-base font-medium">
                      {TASK_LABELS[taskType]}
                    </Label>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        ) : (
          <Card className="p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Rustdag</h3>
              <p className="text-sm text-muted-foreground">
                Morgen weer verder! 💪
              </p>
            </div>
          </Card>
        )}

        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setFormData((prev) => ({ ...prev, isRestDay: !prev.isRestDay }))
            }
          >
            {formData.isRestDay ? "Rustdag annuleren" : "Markeer als rustdag"}
          </Button>
          {!formData.isRestDay && <Button type="submit">Opslaan</Button>}
        </div>
      </div>
    </form>
  );
}
