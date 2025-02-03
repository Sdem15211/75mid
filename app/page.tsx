import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-beige">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-green">
            75 Mid Challenge
          </h1>
        </div>
        <Button asChild>
          <Link
            href={session?.user ? "/dashboard" : "/login"}
            className="group transition-all duration-300 relative flex w-full justify-center rounded-md bg-green px-4 py-2 text-sm font-extrabold text-white hover:bg-darkGreen/80 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
          >
            {session?.user ? "Dashboard" : "Login"}
          </Link>
        </Button>
      </div>
    </main>
  );
}
