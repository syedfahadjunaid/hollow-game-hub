"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";

const menuItems = [
  {
    label: "START GAME",
    url: "/club/games",
    gif: "/images/pixel-gamepad.gif",
  },
  {
    label: "PVP MULTIPLAYER ARENA",
    url: "/club/pvp",
    gif: "/images/pixel-heart.gif",
  },
  {
    label: "COSMETICS SHOP & LOCKER",
    url: "/club/shop",
    gif: "/images/pixel-coin.gif",
  },
  {
    label: "QUESTS & BATTLE PASS",
    url: "/club/quests",
    gif: "/images/pixel-coin.gif",
  },
  {
    label: "GUILDS & SQUADS",
    url: "/club/guilds",
    gif: "/images/pixel-gamepad.gif",
  },
  {
    label: "FRIENDS & DIRECT CHAT",
    url: "/club/friends",
    gif: "/images/pixel-heart.gif",
  },
  {
    label: "AI CHAT ASSISTANT",
    url: "/club/chat",
    gif: "/images/pixel-coin.gif",
  },
  {
    label: "HIGH SCORES & DASHBOARD",
    url: "/club/dashboard",
    gif: "/images/pixel-heart.gif",
  },
  {
    label: "COMMUNITY FORUM",
    url: "/club/forum",
    gif: "/images/pixel-coin.gif",
  },
  {
    label: "ADMIN & MODERATION",
    url: "/club/admin",
    gif: "/images/pixel-coin.gif",
  },
];

export default function MainMenu({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      gsap.fromTo(
        listRef.current.children,
        { scale: 0.9, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "back.out(1.5)" }
      );
    }
  }, []);

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <Image
            src="/images/pixel-coin.gif"
            alt="Retro Coin"
            width={24}
            height={24}
            className="size-6 object-contain pixelated"
            unoptimized
          />
          <CardTitle>Main Menu</CardTitle>
          <Image
            src="/images/pixel-coin.gif"
            alt="Retro Coin"
            width={24}
            height={24}
            className="size-6 object-contain pixelated"
            unoptimized
          />
        </div>
        <CardDescription>Retro 8-bit Quest</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={listRef} className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.url} className="w-full">
              <Button className="w-full flex items-center justify-between gap-3 group transition-transform duration-150 hover:scale-[1.02]">
                <Image
                  src={item.gif}
                  alt={item.label}
                  width={20}
                  height={20}
                  className="size-5 object-contain pixelated shrink-0 group-hover:rotate-12 transition-transform"
                  unoptimized
                />
                <span className="truncate">{item.label}</span>
                <span className="text-amber-400 group-hover:translate-x-1 transition-transform">▶</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
