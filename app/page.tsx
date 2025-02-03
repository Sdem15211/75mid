import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            75 MID Challenge
          </h1>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild className="w-full sm:w-[200px]">
            <Link href={session?.user ? "/dashboard" : "/login"}>
              {session?.user ? "Dashboard" : "Login"}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
