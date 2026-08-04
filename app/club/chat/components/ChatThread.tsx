"use client";

import { useEffect, useRef } from "react";
import { IconDeviceGamepad2 } from "@tabler/icons-react";

import { Skeleton } from "@/components/ui/8bit/skeleton";
import type { Message } from "@/lib/gaming/types";

import { MessageBubble } from "./MessageBubble";

const SUGGESTIONS = [
  "Best beginner builds in Elden Ring?",
  "Compare Baldur's Gate 3 and Divinity 2",
  "Explain Valorant's economy system",
];

interface ChatThreadProps {
  messages: Message[];
  /** Optimistic user message, shown before the server echoes it back. */
  pendingUserMessage?: string | null;
  streamingText?: string;
  isStreaming?: boolean;
  isLoading?: boolean;
  onSuggestion?: (text: string) => void;
}

export function ChatThread({
  messages,
  pendingUserMessage,
  streamingText,
  isStreaming,
  isLoading,
  onSuggestion,
}: ChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Keep the newest content in view as tokens arrive.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, pendingUserMessage, streamingText]);

  const isEmpty =
    !isLoading && messages.length === 0 && !pendingUserMessage && !streamingText;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-16 w-2/3" />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <span className="flex size-14 items-center justify-center bg-foreground text-background dark:bg-ring dark:text-background">
          <IconDeviceGamepad2 className="size-8" />
        </span>
        <p className="retro text-xs tracking-widest sm:text-sm">
          ASK GG ANYTHING ABOUT GAMES
        </p>
        <p className="max-w-sm text-xs text-muted-foreground">
          Mechanics, lore, builds, comparisons, esports and gaming hardware.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSuggestion?.(s)}
              className="border-2 border-foreground px-2 py-1 text-[10px] transition-colors hover:bg-muted dark:border-ring sm:text-xs"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4">
      {messages.map((m) => (
        <MessageBubble key={m.id} role={m.role} content={m.content} />
      ))}

      {pendingUserMessage &&
        messages[messages.length - 1]?.content !== pendingUserMessage && (
          <MessageBubble role="user" content={pendingUserMessage} />
        )}

      {isStreaming && (
        <MessageBubble
          role="assistant"
          content={streamingText || ""}
          streaming={true}
        />
      )}

      <div ref={endRef} />
    </div>
  );
}
