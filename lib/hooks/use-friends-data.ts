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
  const res = await fetch("/api/users/daily-progress", {
    // Prevent caching in production
    cache: process.env.NODE_ENV === "production" ? "no-store" : "default",
  });
  if (!res.ok) {
    const error = await res.text();
    console.error("Failed to fetch users progress:", error);
    throw new Error(error || "Failed to fetch users progress");
  }
  return res.json();
}

export const FRIENDS_QUERY_KEY = ["users-progress"] as const;

export function useFriendsData() {
  return useQuery({
    queryKey: FRIENDS_QUERY_KEY,
    queryFn: fetchAllUsersProgress,
    // Refetch data every minute in production, every 5 minutes in development
    refetchInterval:
      process.env.NODE_ENV === "production" ? 60 * 1000 : 5 * 60 * 1000,
    // Always refetch on window focus in production
    refetchOnWindowFocus: true,
    // Retry up to 3 times if the request fails
    retry: 3,
    // Show stale data while revalidating
    staleTime: process.env.NODE_ENV === "production" ? 0 : 5 * 60 * 1000,
  });
}

// Hook to invalidate friends data cache
export function useInvalidateFriendsData() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY });
}
