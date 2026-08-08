"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/8bit/badge";
import { Button } from "@/components/ui/8bit/button";
import { Progress } from "@/components/ui/8bit/progress";

import "@/components/ui/8bit/styles/retro.css";

interface GameHero1Props {
  actions?: Array<{
    href?: string;
    label: string;
    variant?: "default" | "destructive" | "ghost" | "outline" | "secondary";
  }>;
  className?: string;
  description?: string;
  xpLabel?: string;
  xpValue?: number;
  subtitle?: string;
  title: string;
}

export default function GameHero1({
  title = "LAUNCH SEQUENCE INITIATED",
  subtitle = "v2.0 — Now Live",
  description = "Your product is ready for battle. Ship it before the competition respawns.",
  actions = [
    { label: "AI CHAT NOW", variant: "default", href: "/club/chat" },
    { label: "VIEW DASHBOARD", variant: "outline", href: "/club/dashboard" },
  ],
  xpLabel = "XP to Next Level",
  xpValue = 72,
  className,
}: GameHero1Props) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (badgeRef.current) {
      gsap.to(badgeRef.current, {
        y: -6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
    if (heartRef.current) {
      gsap.to(heartRef.current, {
        scale: 1.15,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <section className={cn("relative w-full px-4 py-4 md:py-6", className)}>
      <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
        {/* Retro Badge Artwork */}
        <div ref={badgeRef} className="mb-3 relative group cursor-pointer">
          <div className="relative size-24 md:size-28 rounded-lg overflow-hidden border-2 border-foreground shadow-md dark:border-ring">
            <Image
              src="/images/retro_pixel_arcade.jpg"
              alt="Retro Pixel Arcade"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {subtitle && (
          <div className="mb-3 flex items-center justify-center gap-2">
            <Image
              ref={heartRef}
              src="/images/pixel-heart.gif"
              alt="Pixel Heart GIF"
              width={20}
              height={20}
              className="size-5 object-contain pixelated"
              unoptimized
            />
            <Badge>{subtitle}</Badge>
            <Image
              src="/images/pixel-coin.gif"
              alt="Pixel Coin GIF"
              width={20}
              height={20}
              className="size-5 object-contain pixelated"
              unoptimized
            />
          </div>
        )}

        <h1 className="retro mb-3 font-bold text-base tracking-tight sm:text-lg md:text-2xl">
          {title}
        </h1>

        {description && (
          <p className="mx-auto mb-4 max-w-lg text-muted-foreground retro text-[9px] leading-relaxed">
            {description}
          </p>
        )}

        {actions.length > 0 && (
          <div className="mb-4 flex flex-wrap justify-center gap-3">
            {actions.map((action) =>
              action.href ? (
                <Button asChild key={action.label} variant={action.variant} size="sm">
                  <Link href={action.href} className="flex items-center gap-2">
                    <span>{action.label}</span>
                  </Link>
                </Button>
              ) : (
                <Button key={action.label} variant={action.variant} size="sm">
                  {action.label}
                </Button>
              ),
            )}
          </div>
        )}

        {/* Health bar */}
        <div className="mx-auto w-full max-w-xs">
          <div className="retro mb-1.5 flex justify-between text-[10px]">
            <span className="flex items-center gap-1">
              <Image
                src="/images/pixel-heart.gif"
                alt="Heart"
                width={14}
                height={14}
                className="size-3.5 object-contain pixelated"
                unoptimized
              />
              {xpLabel}
            </span>
            <span>{xpValue}%</span>
          </div>
          <Progress className="h-3" value={xpValue} />
        </div>
      </div>
    </section>
  );
}
