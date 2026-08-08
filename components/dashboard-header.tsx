"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

import { Button } from "@/components/ui/8bit/button";
import { useSidebar } from "@/components/ui/sidebar";
import { SoundToggle } from "@/components/sound-toggle";

export function DashboardHeader() {
  const { toggleSidebar, open } = useSidebar();
  const headerRef = useRef<HTMLElement>(null);
  const coinRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
    if (coinRef.current) {
      gsap.to(coinRef.current, {
        y: -3,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 flex h-10 shrink-0 items-center gap-2 border-foreground border-b-2 bg-background/95 dark:border-ring px-2">
      <div className="flex h-full w-full items-center justify-between gap-2 pr-2">
        <div className="flex items-center gap-2">
          <Button onClick={toggleSidebar} variant="ghost" className="h-8 px-2">
            {open ? (
              <svg
                className="size-5"
                color="currentColor"
                fill="currentColor"
                height="50"
                stroke="currentColor"
                strokeWidth="0.25"
                viewBox="0 0 256 256"
                width="50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Close sidebar</title>
                <rect height="14" rx="1" width="14" x="80" y="120" />
                <rect height="14" rx="1" width="14" x="112" y="120" />
                <rect height="14" rx="1" width="14" x="96" y="120" />
                <rect height="14" rx="1" width="14" x="128" y="120" />
                <rect height="14" rx="1" width="14" x="160" y="120" />
                <rect height="14" rx="1" width="14" x="176" y="120" />
                <rect height="14" rx="1" width="14" x="96" y="104" />
                <rect height="14" rx="1" width="14" x="112" y="88" />
                <rect height="14" rx="1" width="14" x="128" y="72" />
                <rect height="14" rx="1" width="14" x="96" y="136" />
                <rect height="14" rx="1" width="14" x="112" y="152" />
                <rect height="14" rx="1" width="14" x="128" y="168" />
                <rect height="14" rx="1" width="14" x="192" y="120" />
                <rect height="14" rx="1" width="14" x="144" y="120" />
                <rect height="14" rx="1" width="14" x="48" y="64" />
                <rect height="14" rx="1" width="14" x="48" y="80" />
                <rect height="14" rx="1" width="14" x="48" y="96" />
                <rect height="14" rx="1" width="14" x="48" y="112" />
                <rect height="14" rx="1" width="14" x="48" y="128" />
                <rect height="14" rx="1" width="14" x="48" y="144" />
                <rect height="14" rx="1" width="14" x="48" y="160" />
                <rect height="14" rx="1" width="14" x="48" y="176" />
              </svg>
            ) : (
              <svg
                className="size-5"
                color="currentColor"
                fill="currentColor"
                height="50"
                stroke="currentColor"
                strokeWidth="0.25"
                viewBox="0 0 256 256"
                width="50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Open sidebar</title>
                <rect height="14" rx="1" width="14" x="48" y="120" />
                <rect height="14" rx="1" width="14" x="80" y="120" />
                <rect height="14" rx="1" width="14" x="64" y="120" />
                <rect height="14" rx="1" width="14" x="96" y="120" />
                <rect height="14" rx="1" width="14" x="128" y="120" />
                <rect height="14" rx="1" width="14" x="144" y="120" />
                <rect height="14" rx="1" width="14" x="144" y="136" />
                <rect height="14" rx="1" width="14" x="128" y="152" />
                <rect height="14" rx="1" width="14" x="112" y="72" />
                <rect height="14" rx="1" width="14" x="112" y="168" />
                <rect height="14" rx="1" width="14" x="160" y="120" />
                <rect height="14" rx="1" width="14" x="144" y="104" />
                <rect height="14" rx="1" width="14" x="128" y="88" />
                <rect height="14" rx="1" width="14" x="112" y="120" />
                <rect height="14" rx="1" width="14" x="192" y="64" />
                <rect height="14" rx="1" width="14" x="192" y="80" />
                <rect height="14" rx="1" width="14" x="192" y="96" />
                <rect height="14" rx="1" width="14" x="192" y="112" />
                <rect height="14" rx="1" width="14" x="192" y="128" />
                <rect height="14" rx="1" width="14" x="192" y="144" />
                <rect height="14" rx="1" width="14" x="192" y="160" />
                <rect height="14" rx="1" width="14" x="192" y="176" />
              </svg>
            )}
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Image
            ref={coinRef}
            src="/images/pixel-coin.gif"
            alt="Retro Coin"
            width={18}
            height={18}
            className="size-4.5 shrink-0 object-contain pixelated"
            unoptimized
          />
          <SoundToggle />
          <Link href="https://github.com/TheOrcDev/8bitcn-ui" target="_blank">
            <Button
              className="retro flex items-center gap-2 h-7 px-2"
              size="sm"
              variant="ghost"
            >
              <svg
                className="size-5"
                color="currentColor"
                fill="currentColor"
                height="50"
                stroke="currentColor"
                strokeWidth="0.25"
                viewBox="0 0 256 256"
                width="50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>GitHub</title>
                <rect height="14" rx="1" width="14" x="200" y="80" />
                <rect height="14" rx="1" width="14" x="184" y="64" />
                <rect height="14" rx="1" width="14" x="200" y="96" />
                <rect height="14" rx="1" width="14" x="168" y="48" />
                <rect height="14" rx="1" width="14" x="72" y="48" />
                <rect height="14" rx="1" width="14" x="72" y="64" />
                <rect height="14" rx="1" width="14" x="88" y="48" />
                <rect height="14" rx="1" width="14" x="152" y="48" />
                <rect height="14" rx="1" width="14" x="104" y="48" />
                <rect height="14" rx="1" width="14" x="136" y="48" />
                <rect height="14" rx="1" width="14" x="120" y="48" />
                <rect height="14" rx="1" width="14" x="168" y="64" />
                <rect height="14" rx="1" width="14" x="104" y="64" />
                <rect height="14" rx="1" width="14" x="136" y="64" />
                <rect height="14" rx="1" width="14" x="120" y="64" />
                <rect height="14" rx="1" width="14" x="56" y="64" />
                <rect height="14" rx="1" width="14" x="40" y="80" />
                <rect height="14" rx="1" width="14" x="40" y="96" />
                <rect height="14" rx="1" width="14" x="40" y="112" />
                <rect height="14" rx="1" width="14" x="40" y="128" />
                <rect height="14" rx="1" width="14" x="56" y="80" />
                <rect height="14" rx="1" width="14" x="56" y="96" />
                <rect height="14" rx="1" width="14" x="56" y="112" />
                <rect height="14" rx="1" width="14" x="56" y="128" />
                <rect height="14" rx="1" width="14" x="184" y="80" />
                <rect height="14" rx="1" width="14" x="184" y="96" />
                <rect height="14" rx="1" width="14" x="184" y="112" />
                <rect height="14" rx="1" width="14" x="168" y="80" />
                <rect height="14" rx="1" width="14" x="184" y="144" />
                <rect height="14" rx="1" width="14" x="72" y="80" />
                <rect height="14" rx="1" width="14" x="88" y="144" />
                <rect height="14" rx="1" width="14" x="184" y="128" />
                <rect height="14" rx="1" width="14" x="72" y="144" />
                <rect height="14" rx="1" width="14" x="168" y="144" />
                <rect height="14" rx="1" width="14" x="152" y="144" />
                <rect height="14" rx="1" width="14" x="136" y="144" />
                <rect height="14" rx="1" width="14" x="104" y="144" />
                <rect height="14" rx="1" width="14" x="168" y="128" />
                <rect height="14" rx="1" width="14" x="72" y="128" />
                <rect height="14" rx="1" width="14" x="168" y="160" />
                <rect height="14" rx="1" width="14" x="152" y="160" />
                <rect height="14" rx="1" width="14" x="88" y="192" />
                <rect height="14" rx="1" width="14" x="72" y="176" />
                <rect height="14" rx="1" width="14" x="56" y="176" />
                <rect height="14" rx="1" width="14" x="56" y="160" />
                <rect height="14" rx="1" width="14" x="40" y="160" />
                <rect height="14" rx="1" width="14" x="152" y="176" />
                <rect height="14" rx="1" width="14" x="88" y="176" />
                <rect height="14" rx="1" width="14" x="152" y="192" />
                <rect height="14" rx="1" width="14" x="168" y="192" />
                <rect height="14" rx="1" width="14" x="72" y="192" />
                <rect height="14" rx="1" width="14" x="168" y="176" />
                <rect height="14" rx="1" width="14" x="184" y="176" />
                <rect height="14" rx="1" width="14" x="184" y="160" />
                <rect height="14" rx="1" width="14" x="200" y="160" />
                <rect height="14" rx="1" width="14" x="200" y="128" />
                <rect height="14" rx="1" width="14" x="200" y="144" />
                <rect height="14" rx="1" width="14" x="40" y="144" />
                <rect height="14" rx="1" width="14" x="200" y="112" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
