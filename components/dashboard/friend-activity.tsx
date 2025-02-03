"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TASK_LABELS } from "@/lib/challenge-utils";
import { useFriendsData } from "@/lib/hooks/use-friends-data";
import { cn } from "@/lib/utils";

interface FriendActivityProps {
  currentDay: number;
}

export function FriendActivity({ currentDay }: FriendActivityProps) {
  const { data: users, isLoading } = useFriendsData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Vrienden Activiteit</h2>
          <p className="text-sm text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vrienden Activiteit</h2>
        <p className="text-sm text-muted-foreground">
          Bekijk hoe je vrienden het vandaag doen
        </p>
      </div>

      <ScrollArea className="pr-4">
        <div className="space-y-4">
          {users?.map((user) => {
            const completedTasks =
              user.day?.completions.filter((c) => c.completed).length ?? 0;
            const totalTasks = Object.keys(TASK_LABELS).length;

            return (
              <Collapsible key={user.id}>
                <CollapsibleTrigger className="w-full">
                  <Card className="w-full transition-colors hover:bg-muted/50">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={user.image ?? undefined}
                            alt={user.name ?? ""}
                            referrerPolicy="no-referrer"
                          />
                          <AvatarFallback>
                            {user.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1 items-start justify-center">
                          <p className="font-medium">{user.name}</p>
                          {user.day?.isRestDay ? (
                            <Badge variant="secondary">Rustdag</Badge>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {completedTasks}/{totalTasks} taken voltooid
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                    </div>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2 p-4 border-dashed">
                    {user.day?.isRestDay ? (
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold">LOSER</h3>
                        <p className="text-sm text-muted-foreground">
                          Morgen beter 🙏🏼
                        </p>
                      </div>
                    ) : !user.day?.completions.length ? (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        Nog geen taken afgerond vandaag
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {/* Workouts with notes */}
                        <div className="space-y-4">
                          {user.day?.completions
                            .filter((task) =>
                              task.taskType.startsWith("WORKOUT")
                            )
                            .map((task) => (
                              <div key={task.taskType} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={task.completed}
                                    disabled
                                    className={cn(
                                      "opacity-100 data-[state=checked]:bg-primary data-[state=checked]:opacity-100",
                                      "border-primary"
                                    )}
                                  />
                                  <div className="space-y-1">
                                    <label className="text-sm font-medium">
                                      {
                                        TASK_LABELS[
                                          task.taskType as keyof typeof TASK_LABELS
                                        ]
                                      }
                                    </label>
                                    {task.notes && (
                                      <p className="text-sm text-muted-foreground">
                                        {task.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Other tasks */}
                        <div className="space-y-2">
                          {user.day?.completions
                            .filter(
                              (task) => !task.taskType.startsWith("WORKOUT")
                            )
                            .map((task) => (
                              <div
                                key={task.taskType}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  checked={task.completed}
                                  disabled
                                  className={cn(
                                    "opacity-100 data-[state=checked]:bg-primary data-[state=checked]:opacity-100",
                                    "border-primary"
                                  )}
                                />
                                <label className="text-sm">
                                  {
                                    TASK_LABELS[
                                      task.taskType as keyof typeof TASK_LABELS
                                    ]
                                  }
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
