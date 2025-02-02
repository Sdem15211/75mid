"use client";
import { useState } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DailyChecklistProps {
  currentDay: number;
}

// Mock data structure
interface DayData {
  isRestDay: boolean;
  workout1: { completed: boolean; description: string };
  workout2: { completed: boolean; description: string };
  water: boolean;
  reading: boolean;
  diet: boolean;
  alcohol: boolean;
  sleep: boolean;
}

export function DailyChecklist({ currentDay }: DailyChecklistProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [isRestDay, setIsRestDay] = useState(false);
  const [formData, setFormData] = useState<DayData>({
    isRestDay: false,
    workout1: { completed: false, description: "" },
    workout2: { completed: false, description: "" },
    water: false,
    reading: false,
    diet: false,
    alcohol: false,
    sleep: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
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

        {!isRestDay ? (
          <div className="space-y-6">
            {/* Workout tasks */}
            <Card className="overflow-hidden border rounded-lg">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Workout 1 */}
                  <div className="flex items-start gap-4">
                    <Checkbox
                      id="workout1"
                      checked={formData.workout1.completed}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          workout1: {
                            ...prev.workout1,
                            completed: checked as boolean,
                          },
                        }))
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="workout1"
                        className="text-base font-medium"
                      >
                        Workout 1
                      </Label>
                      <Textarea
                        placeholder="Beschrijf je workout..."
                        value={formData.workout1.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            workout1: {
                              ...prev.workout1,
                              description: e.target.value,
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
                      id="workout2"
                      checked={formData.workout2.completed}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          workout2: {
                            ...prev.workout2,
                            completed: checked as boolean,
                          },
                        }))
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="workout2"
                        className="text-base font-medium"
                      >
                        Workout 2
                      </Label>
                      <Textarea
                        placeholder="Beschrijf je workout..."
                        value={formData.workout2.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            workout2: {
                              ...prev.workout2,
                              description: e.target.value,
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
              {[
                { id: "water", label: "3 liter water drinken" },
                { id: "reading", label: "10 pagina's non-fictie lezen" },
                { id: "diet", label: "Gezond dieet volgen" },
                { id: "alcohol", label: "Geen alcohol drinken" },
                { id: "sleep", label: "8 uur slaap behalen" },
              ].map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      id={task.id}
                      checked={formData[task.id as keyof DayData] as boolean}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          [task.id]: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor={task.id} className="text-base font-medium">
                      {task.label}
                    </Label>
                  </div>
                  {formData[task.id as keyof DayData] && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
              ))}
            </Card>
          </div>
        ) : (
          <Card className="p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">LOSER</h3>
              <p className="text-sm text-muted-foreground">Morgen beter 🙏🏼</p>
            </div>
          </Card>
        )}

        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsRestDay(!isRestDay)}
          >
            {isRestDay ? "Rustdag annuleren" : "Markeer als rustdag"}
          </Button>
          {!isRestDay && <Button type="submit">Opslaan</Button>}
        </div>
      </div>
    </form>
  );
}
