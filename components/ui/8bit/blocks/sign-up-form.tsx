"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Label } from "@/components/ui/8bit/label";
import Link from "next/link";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/8bit/alert";
import { registerUserAction } from "@/app/actions/auth-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validatePasswords(pw: string, cp: string) {
    if (pw.length < 8) return "Password must be at least 8 characters";
    if (pw !== cp) return "Passwords do not match";
    return null;
  }

  const customToast = (t, message) => (
    <div
      className={`${
        t.visible ? "animate-custom-enter" : "animate-custom-leave"
      }  items-center shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <Alert variant="destructive">
        <AlertTitle>Warning!</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <div className="flex">
        <Button onClick={() => toast.dismiss(t.id)} className="">
          X
        </Button>
      </div>
    </div>
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const displayName = String(fd.get("username") || "");

    console.log(displayName);

    const validation = validatePasswords(password, confirmPassword);
    if (validation) {
      setError(validation);
      toast.custom((t) => customToast(t, validation));
      return;
    }

    if (!email || !displayName) {
      setError("Please fill all fields");
      toast.custom((t) => customToast(t, "Please fill all fields"));
      return;
    }

    setLoading(true);
    try {
      const response = await registerUserAction({
        email,
        password,
        displayName,
      });
      if (response?.success) {
        toast.custom((t) => customToast(t, response.message));
        // router.push("/main-menu");
      } else {
        const msg = response?.message ?? "Registration failed";
        setError(msg);
        toast.custom((t) => customToast(t, msg));
      }
    } catch (e: any) {
      const msg = e?.message ?? "Registration failed";
      setError(msg);
      toast.custom((t) => customToast(t, msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription className="text-xs">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!error}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-invalid={!!error}
                />
              </div>

              {error && (
                <div>
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
              </Button>

              <p className="text-xs md:text-base text-center text-secondary/90 dark:text-muted-foreground/90 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
                OR
              </p>

              <div className="flex items-center justify-center gap-10">
                <Button variant="outline">Google</Button>
                <Button variant="outline">Github</Button>
                <Button variant="outline">Microsoft</Button>
              </div>
            </div>

            <div className="mt-8 text-center text-xs">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
