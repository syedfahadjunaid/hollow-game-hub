"use client";

import * as React from "react";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useRetroTheme } from "@/hooks/useRetroTheme";

interface RetroModeSwitcherProps {
  className?: string;
  toggleMode?: () => void;
}

export function RetroModeSwitcher({
  className,
  toggleMode,
}: RetroModeSwitcherProps) {
  const { currentConsole, currentMode, updateTheme } = useRetroTheme();

  // This ref MUST be on the element you want to spin
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        rotation: "+=360",
        duration: 0.5,
        ease: "back.out(1.5)",
        // Clear transform after animation to prevent blurry pixel art
        onComplete: () => {
          gsap.set(containerRef.current, { clearProps: "rotation" });
        },
      });
    }

    if (toggleMode) {
      toggleMode();
    } else {
      const newMode = currentMode === "light" ? "dark" : "light";
      updateTheme(currentConsole, newMode);
    }
  };

  return (
    <Button
      variant="outline"
      className="group/toggle h-10 w-10 px-0 hover:bg-transparent"
      onClick={handleToggle}
    >
      <div ref={containerRef} className="flex items-center justify-center">
        <svg
          width="50"
          height="50"
          viewBox="0 0 256 256"
          fill="currentColor"
          className={cn(
            "size-10",
            currentMode === "dark" ? "hidden" : "block",
            className,
          )}
          aria-label="sun-dim"
        >
          <rect x="120" y="88" width="14" height="14" rx="1"></rect>
          <rect x="104" y="88" width="14" height="14" rx="1"></rect>
          <rect x="88" y="104" width="14" height="14" rx="1"></rect>
          <rect x="88" y="120" width="14" height="14" rx="1"></rect>
          <rect x="88" y="136" width="14" height="14" rx="1"></rect>
          <rect x="136" y="88" width="14" height="14" rx="1"></rect>
          <rect x="120" y="152" width="14" height="14" rx="1"></rect>
          <rect x="104" y="152" width="14" height="14" rx="1"></rect>
          <rect x="136" y="152" width="14" height="14" rx="1"></rect>
          <rect x="152" y="104" width="14" height="14" rx="1"></rect>
          <rect x="168" y="72" width="14" height="14" rx="1"></rect>
          <rect x="168" y="168" width="14" height="14" rx="1"></rect>
          <rect x="72" y="168" width="14" height="14" rx="1"></rect>
          <rect x="72" y="72" width="14" height="14" rx="1"></rect>
          <rect x="120" y="56" width="14" height="14" rx="1"></rect>
          <rect x="56" y="120" width="14" height="14" rx="1"></rect>
          <rect x="120" y="184" width="14" height="14" rx="1"></rect>
          <rect x="184" y="120" width="14" height="14" rx="1"></rect>
          <rect x="40" y="120" width="14" height="14" rx="1"></rect>
          <rect x="120" y="40" width="14" height="14" rx="1"></rect>
          <rect x="120" y="200" width="14" height="14" rx="1"></rect>
          <rect x="184" y="184" width="14" height="14" rx="1"></rect>
          <rect x="56" y="184" width="14" height="14" rx="1"></rect>
          <rect x="184" y="56" width="14" height="14" rx="1"></rect>
          <rect x="56" y="56" width="14" height="14" rx="1"></rect>
          <rect x="200" y="120" width="14" height="14" rx="1"></rect>
          <rect x="152" y="120" width="14" height="14" rx="1"></rect>
          <rect x="152" y="136" width="14" height="14" rx="1"></rect>
        </svg>

        <svg
          width="50"
          height="50"
          viewBox="0 0 256 256"
          fill="currentColor"
          className={cn(
            "size-10",
            currentMode === "light" ? "hidden" : "block",
            className,
          )}
          aria-label="moon"
        >
          <rect x="104" y="56" width="14" height="14" rx="1"></rect>
          <rect x="88" y="56" width="14" height="14" rx="1"></rect>
          <rect x="72" y="72" width="14" height="14" rx="1"></rect>
          <rect x="88" y="72" width="14" height="14" rx="1"></rect>
          <rect x="88" y="88" width="14" height="14" rx="1"></rect>
          <rect x="72" y="88" width="14" height="14" rx="1"></rect>
          <rect x="56" y="104" width="14" height="14" rx="1"></rect>
          <rect x="88" y="104" width="14" height="14" rx="1"></rect>
          <rect x="72" y="104" width="14" height="14" rx="1"></rect>
          <rect x="56" y="136" width="14" height="14" rx="1"></rect>
          <rect x="88" y="136" width="14" height="14" rx="1"></rect>
          <rect x="72" y="136" width="14" height="14" rx="1"></rect>
          <rect x="56" y="120" width="14" height="14" rx="1"></rect>
          <rect x="88" y="120" width="14" height="14" rx="1"></rect>
          <rect x="104" y="120" width="14" height="14" rx="1"></rect>
          <rect x="72" y="120" width="14" height="14" rx="1"></rect>
          <rect x="88" y="56" width="14" height="14" rx="1"></rect>
          <rect x="104" y="136" width="14" height="14" rx="1"></rect>
          <rect x="72" y="152" width="14" height="14" rx="1"></rect>
          <rect x="104" y="152" width="14" height="14" rx="1"></rect>
          <rect x="120" y="136" width="14" height="14" rx="1"></rect>
          <rect x="88" y="152" width="14" height="14" rx="1"></rect>
          <rect x="168" y="152" width="14" height="14" rx="1"></rect>
          <rect x="184" y="136" width="14" height="14" rx="1"></rect>
          <rect x="120" y="152" width="14" height="14" rx="1"></rect>
          <rect x="152" y="152" width="14" height="14" rx="1"></rect>
          <rect x="136" y="152" width="14" height="14" rx="1"></rect>
          <rect x="72" y="168" width="14" height="14" rx="1"></rect>
          <rect x="104" y="168" width="14" height="14" rx="1"></rect>
          <rect x="88" y="168" width="14" height="14" rx="1"></rect>
          <rect x="168" y="168" width="14" height="14" rx="1"></rect>
          <rect x="120" y="168" width="14" height="14" rx="1"></rect>
          <rect x="152" y="168" width="14" height="14" rx="1"></rect>
          <rect x="136" y="168" width="14" height="14" rx="1"></rect>
          <rect x="104" y="184" width="14" height="14" rx="1"></rect>
          <rect x="120" y="184" width="14" height="14" rx="1"></rect>
          <rect x="136" y="184" width="14" height="14" rx="1"></rect>
          <rect x="184" y="152" width="14" height="14" rx="1"></rect>
        </svg>
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
