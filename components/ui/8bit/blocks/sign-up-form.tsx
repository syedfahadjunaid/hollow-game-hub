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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
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
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your usernam"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
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
                  required
                  placeholder="Enter your password"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm your password"
                />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
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
