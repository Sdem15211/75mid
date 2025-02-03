import { useQuery } from "@tanstack/react-query";

interface UserDayData {
  id: string;
  name: string | null;
  image: string | null;
  day: {
    isRestDay: boolean;
    isComplete: boolean;
    completions: {
      taskType: string;
      completed: boolean;
      notes?: string | null;
    }[];
  } | null;
}

async function fetchAllUsersProgress(): Promise<UserDayData[]> {
  const res = await fetch("/api/users/daily-progress");
  if (!res.ok) throw new Error("Failed to fetch users progress");
  return res.json();
}

export function useFriendsData() {
  return useQuery({
    queryKey: ["users-progress"],
    queryFn: fetchAllUsersProgress,
  });
}
