"use client";

import { useState, useEffect } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  TASK_LABELS,
  isWithinChallengePeriod,
  getDayNumber,
} from "@/lib/challenge-utils";
import {
  useDayData,
  useUpdateDayData,
  transformDayDataToFormData,
  FormData,
} from "@/lib/hooks/use-day-data";

type WorkoutData = {
  completed: boolean;
  description: string;
};

type OtherTaskType = "WATER_INTAKE" | "READING" | "HEALTHY_DIET" | "SLEEP_GOAL";

interface DailyChecklistProps {
  initialDate: Date;
  userId: string;
}

export function DailyChecklist({ initialDate, userId }: DailyChecklistProps) {
  const [date, setDate] = useState<Date>(initialDate);
  const { data: dayData, isLoading } = useDayData(date, userId);
  const { mutate: updateDay, isPending: isUpdating } = useUpdateDayData();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>(() =>
    transformDayDataToFormData(dayData ?? null)
  );

  // Update form data when dayData changes
  useEffect(() => {
    setFormData(transformDayDataToFormData(dayData ?? null));
  }, [dayData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDay(
      {
        date,
        userId,
        formData,
      },
      {
        onSuccess: () => {
          toast({
            title: "Voortgang opgeslagen",
            description: "Je voortgang is succesvol bijgewerkt.",
            variant: "success",
          });
        },
        onError: (error) => {
          toast({
            title: "Er is iets misgegaan",
            description:
              "Je voortgang kon niet worden opgeslagen. Probeer het opnieuw.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const isToday = isSameDay(date, new Date());
  const isWithinPeriod = isWithinChallengePeriod(date);
  const dayNumber = getDayNumber(date);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {dayNumber ? `Dag ${dayNumber}` : "Buiten challenge periode"}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => setDate(subDays(date, 1))}
              disabled={isUpdating}
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
              disabled={isToday || isUpdating}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isWithinPeriod ? (
          <Card className="p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">
                Deze dag valt buiten de 75MID challenge
              </h3>
              <p className="text-sm text-muted-foreground">
                Kies een datum binnen de challenge periode
              </p>
            </div>
          </Card>
        ) : !formData.isRestDay ? (
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
                      disabled={isUpdating}
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
                        disabled={isUpdating}
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
                      disabled={isUpdating}
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
                        disabled={isUpdating}
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
                ] as const
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
                      disabled={isUpdating}
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

        {isWithinPeriod && (
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  isRestDay: !prev.isRestDay,
                }));
                updateDay(
                  {
                    date,
                    userId,
                    formData: { ...formData, isRestDay: !formData.isRestDay },
                  },
                  {
                    onSuccess: () => {
                      toast({
                        title: !formData.isRestDay
                          ? "LOSER"
                          : "Rustdag geannuleerd, lekker bezig",
                        description: !formData.isRestDay
                          ? "Deze dag is nu gemarkeerd als rustdag."
                          : "Deze dag is niet langer een rustdag.",
                        variant: "default",
                      });
                    },
                    onError: () => {
                      toast({
                        title: "Er is iets misgegaan",
                        description:
                          "De wijziging kon niet worden opgeslagen. Probeer het opnieuw.",
                        variant: "destructive",
                      });
                      // Revert the state change on error
                      setFormData((prev) => ({
                        ...prev,
                        isRestDay: !prev.isRestDay,
                      }));
                    },
                  }
                );
              }}
              disabled={isUpdating}
            >
              {formData.isRestDay ? "Rustdag annuleren" : "Markeer als rustdag"}
            </Button>
            {!formData.isRestDay && (
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Opslaan..." : "Opslaan"}
              </Button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
