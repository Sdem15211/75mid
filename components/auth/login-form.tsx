import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import GoogleSignInButton from "@/components/auth/signin-button";

export default function LoginForm() {
  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
          Log in
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Sign in with your Google account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <GoogleSignInButton />
      </CardContent>
    </Card>
  );
}
