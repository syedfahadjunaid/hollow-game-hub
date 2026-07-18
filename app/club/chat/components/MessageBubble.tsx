"use client";

import { IconDeviceGamepad2, IconUser } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  /** Render the blinking caret while tokens are still arriving. */
  streaming?: boolean;
}

export function MessageBubble({ role, content, streaming }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full items-start gap-2 sm:gap-3",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Pixel avatar — assistant reuses the app-wide gamepad brand mark */}
      <span
        aria-hidden="true"
        className={cn(
          "flex size-8 shrink-0 items-center justify-center sm:size-9",
          isUser
            ? "bg-muted text-foreground"
            : "bg-foreground text-background dark:bg-ring dark:text-background"
        )}
      >
        {isUser ? (
          <IconUser className="size-4 sm:size-5" />
        ) : (
          <IconDeviceGamepad2 className="size-4 sm:size-5" />
        )}
      </span>

      <div
        className={cn(
          "relative max-w-[85%] border-y-4 border-foreground px-3 py-2 dark:border-ring sm:max-w-[75%]",
          isUser ? "bg-muted" : "bg-card"
        )}
      >
        {/* Pixel side borders, matching the 8bit card treatment */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -mx-1 border-x-4 border-foreground dark:border-ring"
        />

        <p className="relative z-10 whitespace-pre-wrap break-words text-xs leading-relaxed sm:text-sm">
          {content}
          {streaming && (
            <span className="ml-0.5 inline-block animate-pulse font-bold">_</span>
          )}
        </p>
      </div>
    </div>
  );
}
