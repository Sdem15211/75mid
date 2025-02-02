import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FriendActivityProps {
  currentDay: number;
}

// Mock data
const mockFriends = [
  {
    id: 1,
    name: "Anna de Vries",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
    completedTasks: 7,
    totalTasks: 7,
    isRestDay: false,
  },
  {
    id: 2,
    name: "Peter Jansen",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peter",
    completedTasks: 4,
    totalTasks: 7,
    isRestDay: false,
  },
  {
    id: 3,
    name: "Sophie Bakker",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    completedTasks: 0,
    totalTasks: 0,
    isRestDay: true,
  },
];

export function FriendActivity({ currentDay }: FriendActivityProps) {
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
          {mockFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={friend.image} alt={friend.name} />
                  <AvatarFallback>
                    {friend.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{friend.name}</p>
                  {friend.isRestDay ? (
                    <Badge variant="secondary">Rustdag</Badge>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {friend.completedTasks}/{friend.totalTasks} taken voltooid
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
