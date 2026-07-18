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
import { useLayoutEffect, useRef, useState } from "react";
import toast, { type Toast } from "react-hot-toast";
import { gsap } from "gsap";
import { loginUserAction } from "@/app/actions/auth-actions";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/8bit/alert";

import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandWindows,
  IconDeviceGamepad2,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

type Props = React.ComponentPropsWithoutRef<"div">;

const socials = [
  { label: "Google", Icon: IconBrandGoogle },
  { label: "Github", Icon: IconBrandGithub },
  { label: "Microsoft", Icon: IconBrandWindows },
];

export function LoginForm({ className, ...props }: Props) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Entrance + ambient animations. useLayoutEffect applies the "from"
  // states before the first paint, so there is no flash of un-animated UI.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".js-card", { y: 40, scale: 0.98, opacity: 0, duration: 0.8 })
        .from(".js-badge", { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.35")
        .from(".js-title", { x: -24, opacity: 0, duration: 0.45 }, "-=0.25")
        .from(".js-desc", { x: -16, opacity: 0, duration: 0.4 }, "-=0.3")
        .from(
          ".js-field",
          { x: -20, opacity: 0, duration: 0.4, stagger: 0.12 },
          "-=0.2"
        )
        .from(".js-submit", { y: 12, opacity: 0, duration: 0.4 }, "-=0.1")
        .from(".js-or", { opacity: 0, duration: 0.3 }, "-=0.1")
        .from(
          ".js-social",
          { y: 14, scale: 0.8, opacity: 0, duration: 0.4, stagger: 0.1 },
          "-=0.1"
        )
        .from(".js-footer", { opacity: 0, duration: 0.3 }, "-=0.1");

      // Floating game-pad badge
      gsap.to(".js-badge-icon", {
        y: -5,
        rotate: 6,
        duration: 1.1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Blinking title cursor
      gsap.to(".js-cursor", {
        opacity: 0,
        duration: 0.5,
        ease: "steps(1)",
        repeat: -1,
        yoyo: true,
      });

      // "INSERT COIN" pulse
      gsap.to(".js-coin", {
        opacity: 0.35,
        duration: 0.8,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Subtle focus glow on the pixel input frames. GSAP drives the scale;
  // the ring shadow uses a native CSS transition so `var(--ring)` resolves
  // reliably in every theme.
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const frame = e.currentTarget.parentElement;
    if (!frame) return;
    frame.style.transition = "box-shadow 0.25s ease-out";
    frame.style.boxShadow = "0 0 0 3px var(--ring)";
    gsap.to(frame, { scale: 1.015, duration: 0.25, ease: "power2.out" });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const frame = e.currentTarget.parentElement;
    if (!frame) return;
    frame.style.boxShadow = "none";
    gsap.to(frame, { scale: 1, duration: 0.25, ease: "power2.out" });
  };

  const customToast = (t: Toast, message: string, isError?: boolean) => (
    <div
      className={`${
        t.visible ? "animate-custom-enter" : "animate-custom-leave"
      }  items-center shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <Alert variant={isError ? "destructive" : "default"}>
        <AlertTitle>{isError ? "Warning!" : "Success"}</AlertTitle>
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
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));

    if (!email || !password) return;

    setLoading(true);
    try {
      const response = await loginUserAction({ email, password });
      if (response?.success) {
        toast.custom((t) => customToast(t, response.message));
        router.push("/club/main-menu");
      } else {
        toast.custom((t) => customToast(t, response.message, true));
        setLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.custom((t) => customToast(t, message, true));
      setLoading(false);
    }
  }

  return (
    <div ref={rootRef} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="js-card">
      <Card className="relative">
        {/* CRT scanline overlay for retro flavor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(0,0,0,0.85) 0px, rgba(0,0,0,0.85) 1px, transparent 1px, transparent 3px)",
          }}
        />

        <CardHeader className="relative z-20">
          <div className="js-badge flex items-center gap-3">
            <span className="js-badge-icon inline-flex size-9 items-center justify-center bg-foreground text-background dark:bg-ring">
              <IconDeviceGamepad2 className="size-5" />
            </span>
            <CardTitle className="js-title text-2xl">
              Login<span className="js-cursor">_</span>
            </CardTitle>
          </div>
          <CardDescription className="js-desc text-xs">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-20">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="js-field grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                />
              </div>

              <div className="js-field grid gap-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="inline-block text-xs underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pr-12"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 z-20 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <IconEyeOff className="size-5" />
                    ) : (
                      <IconEye className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="js-submit w-full"
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </Button>

              <p className="js-or text-xs md:text-base text-center text-secondary/90 dark:text-muted-foreground/90 drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
                OR
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                {socials.map(({ label, Icon }) => (
                  <Button
                    key={label}
                    type="button"
                    variant="outline"
                    className="js-social"
                  >
                    <Icon className="size-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <p className="js-coin mt-6 text-center text-[10px] tracking-widest text-muted-foreground">
              ★ INSERT COIN TO CONTINUE ★
            </p>

            <div className="js-footer mt-4 text-center text-xs">
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
    </div>
  );
}
