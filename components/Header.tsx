"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconDeviceGamepad2 } from "@tabler/icons-react";
import gsap from "gsap";

import HeaderProfile from "./HeaderProfile";
import { Card } from "./ui/8bit/card";
import ThemeSelector from "./ui/8bit/theme-selector";
import { SoundToggle } from "./sound-toggle";
import { NotificationBell } from "./NotificationBell";

interface IHeaderProps {
  showProfile?: boolean;
}

export default function Header({ showProfile }: IHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const gifRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    // Entrance animation with GSAP
    gsap.fromTo(
      headerRef.current,
      { y: -15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
    );

    // Continuous subtle floating animation for retro GIF coin
    if (gifRef.current) {
      gsap.to(gifRef.current, {
        y: -3,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    // Hover rotation / pulse on logo mark
    const logoEl = logoRef.current;
    if (logoEl) {
      const onEnter = () => gsap.to(logoEl, { scale: 1.15, rotate: 12, duration: 0.2, ease: "back.out(2)" });
      const onLeave = () => gsap.to(logoEl, { scale: 1, rotate: 0, duration: 0.2, ease: "power1.out" });
      logoEl.addEventListener("mouseenter", onEnter);
      logoEl.addEventListener("mouseleave", onLeave);
      return () => {
        logoEl.removeEventListener("mouseenter", onEnter);
        logoEl.removeEventListener("mouseleave", onLeave);
      };
    }
  }, []);

  return (
    <Card className="z-10 bg-background shadow-sm py-0">
      <div ref={headerRef} className="flex h-10 items-center justify-between gap-2 px-3 sm:px-4">
        {/* Brand: pixel gamepad mark + retro animated GIF + wordmark */}
        <Link href="/" className="flex min-w-0 items-center gap-2 group">
          <span
            ref={logoRef}
            className="flex size-7 shrink-0 items-center justify-center bg-foreground text-background transition-transform dark:bg-ring dark:text-background"
          >
            <IconDeviceGamepad2 className="size-4" />
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <Image
              ref={gifRef}
              src="/images/pixel-coin.gif"
              alt="Retro Animated Coin"
              width={18}
              height={18}
              className="size-4.5 shrink-0 object-contain pixelated"
              unoptimized
            />
            <span className="block sm:hidden text-xs font-black font-mono tracking-wider text-amber-400">
              HGH
            </span>
            <h1 className="hidden min-w-0 truncate text-sm font-bold tracking-tight sm:block md:text-base group-hover:text-amber-400 transition-colors">
              Hollow Game Hub
            </h1>
          </div>
        </Link>
        <div className="flex shrink-0 items-center justify-center gap-1.5 sm:gap-3">
          <NotificationBell />
          <SoundToggle />
          <ThemeSelector />
          {showProfile && <HeaderProfile />}
        </div>
      </div>
    </Card>
  );
}
