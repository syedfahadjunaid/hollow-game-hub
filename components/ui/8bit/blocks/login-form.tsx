"use client";

import { cn } from "@/lib/utils";

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
import { useRouter } from "next/navigation";
import { SubmitEvent } from "react";
import toast from "react-hot-toast";
import { loginUserAction } from "@/app/actions/auth-actions";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/8bit/alert";

type Props = React.ComponentPropsWithoutRef<"div">;

export function LoginForm({ className, ...props }: Props) {
  const router = useRouter();

  function encode(value: string) {
    return encodeURIComponent(value);
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));

    if (email && password) {
      try {
        const response = await loginUserAction({ email, password });
        if (response?.success) {
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-custom-enter" : "animate-custom-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <Alert>
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>{response.message}</AlertDescription>
              </Alert>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          ));
          router.push("/main-menu");
        } else if (!response.success) {
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-custom-enter" : "animate-custom-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <Alert variant="destructive">
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>{response.message}</AlertDescription>
              </Alert>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          ));
        }
      } catch (e: any) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-custom-enter" : "animate-custom-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <Alert variant="destructive">
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                You can add components and dependencies to your app using the
                cli.
              </AlertDescription>
            </Alert>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ));
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription className="text-xs">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
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
                  <a
                    href="#"
                    className="inline-block text-xs underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
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
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
