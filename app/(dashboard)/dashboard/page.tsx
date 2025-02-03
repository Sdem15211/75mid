import { auth } from "@/lib/auth";
import { DailyChecklist } from "@/components/dashboard/daily-checklist";
import { FriendActivity } from "@/components/dashboard/friend-activity";
import { SignOutButton } from "@/components/auth/signout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Trophy } from "lucide-react";
import { getDayNumber } from "@/lib/challenge-utils";
import { startOfDay } from "date-fns";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const today = startOfDay(new Date());
  const currentDay = getDayNumber(today) ?? 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-8 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-xl tracking-tight font-semibold flex items-center">
            <Trophy className="w-4 h-4 mr-2 text-primary" />
            75MID
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="py-6 px-8">
        {/* Welcome message */}
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Welkom {session.user.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            Het is dag {currentDay} van de 75MID challenge.
          </p>
        </div>

        {/* Content grid with sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between">
          {/* Main content area */}
          <div className="flex-1">
            <div className="p-6 rounded-lg border bg-card">
              <DailyChecklist initialDate={today} userId={session.user.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-[400px] h-full">
            <div className="p-6 rounded-lg border bg-card sticky top-6">
              <FriendActivity currentDay={currentDay} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
