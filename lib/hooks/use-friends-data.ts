import { useQuery, useQueryClient } from "@tanstack/react-query";

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

export const FRIENDS_QUERY_KEY = ["users-progress"] as const;

export function useFriendsData() {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEY,
    queryFn: fetchAllUsersProgress,
    // Refetch data every 5 minutes in the background
    refetchInterval: 5 * 60 * 1000,
    // Refetch when window regains focus
    refetchOnWindowFocus: true,
  });
}

// Hook to invalidate friends data cache
export function useInvalidateFriendsData() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY });
}
