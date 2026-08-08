"use client";

import { useEffect, useRef, useState } from "react";
import { IconArrowDown, IconDeviceGamepad2, IconSparkles } from "@tabler/icons-react";

import { Skeleton } from "@/components/ui/8bit/skeleton";
import type { Message } from "@/lib/gaming/types";

import { MessageBubble } from "./MessageBubble";

const SUGGESTIONS = [
  { label: "Elden Ring Builds", query: "Best beginner builds in Elden Ring?" },
  { label: "RPG Comparison", query: "Compare Baldur's Gate 3 and Divinity 2" },
  { label: "Valorant Economy", query: "Explain Valorant's economy system and buy strategies" },
  { label: "Overwatch Lore", query: "Who is Ramattra in Overwatch lore?" },
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
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const isAutoScrollEnabled = useRef(true);

  // Check if user is scrolled near bottom
  const checkScrollPosition = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isBottom = scrollHeight - scrollTop - clientHeight < 120;
    isAutoScrollEnabled.current = isBottom;
    setShowScrollBottom(!isBottom);
  };

  const scrollToBottom = (smooth = true) => {
    endRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
  };

  // Keep newest content in view ONLY if user is already at bottom
  useEffect(() => {
    if (isAutoScrollEnabled.current) {
      scrollToBottom(false);
    }
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
        <span className="flex size-14 items-center justify-center border-2 border-foreground bg-foreground text-background dark:border-ring dark:bg-ring dark:text-background">
          <IconDeviceGamepad2 className="size-8" />
        </span>
        <div>
          <p className="retro text-sm tracking-widest sm:text-base">
            ASK GG ANYTHING ABOUT GAMES
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Mechanics, lore, builds, comparisons, esports and gaming hardware.
          </p>
        </div>

        <div className="mt-3 flex max-w-md flex-wrap items-center justify-center gap-2">
          {SUGGESTIONS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSuggestion?.(item.query)}
              className="flex items-center gap-1.5 border-2 border-foreground bg-muted/40 px-2.5 py-1.5 text-xs transition-colors hover:bg-muted dark:border-ring"
            >
              <IconSparkles className="size-3.5 text-muted-foreground" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div
        ref={containerRef}
        onScroll={checkScrollPosition}
        className="flex h-full flex-col gap-4 overflow-y-auto p-3 sm:p-4"
      >
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

      {showScrollBottom && (
        <button
          type="button"
          onClick={() => {
            isAutoScrollEnabled.current = true;
            scrollToBottom(true);
          }}
          className="absolute bottom-3 right-4 z-20 flex items-center gap-1 border-2 border-foreground bg-background px-2.5 py-1 font-mono text-[11px] shadow-md transition-transform active:translate-y-0.5 dark:border-ring"
        >
          <IconArrowDown className="size-3.5 animate-bounce" />
          <span>JUMP TO BOTTOM</span>
        </button>
      )}
    </div>
  );
}
