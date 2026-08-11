"use client";

import React, { useEffect, useRef, useState } from "react";
import { IconSend, IconLoader2, IconSmile } from "@tabler/icons-react";
import { UserChatMessage } from "@/hooks/useCommunityChat";
import { Button } from "@/components/ui/8bit/button";

interface CommunityChatThreadProps {
  roomName: string;
  messages: UserChatMessage[];
  typingUsers: string[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
}

const EMOJI_OPTIONS = ["🔥", "⚔️", "🎯", "🕹️", "👍", "❤️"];

export function CommunityChatThread({
  roomName,
  messages,
  typingUsers,
  isLoading,
  onSendMessage,
  onStartTyping,
  onStopTyping,
  onToggleReaction,
}: CommunityChatThreadProps) {
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    onStartTyping();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
    onStopTyping();
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col border-4 border-foreground bg-card dark:border-ring">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-4 border-foreground bg-muted/60 px-3 py-2 dark:border-ring">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex size-2.5 rounded-full bg-green-500"></span>
          </span>
          <span className="truncate font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            #{roomName || "general"}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase text-muted-foreground">
          REAL-TIME BROADCAST
        </span>
      </div>

      {/* Message List */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center gap-2 font-mono text-xs text-muted-foreground">
            <IconLoader2 className="size-4 animate-spin" />
            Loading transmission history...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <span className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
              CHANNEL EMPTY
            </span>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Be the first player to send a transmission in #{roomName}!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const msgId = msg._id || msg.id || "";
            return (
              <div
                key={msgId}
                className="group flex flex-col gap-1 rounded border-2 border-muted/80 bg-muted/20 p-2.5 transition-colors hover:border-muted-foreground/30"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-bold text-amber-500 dark:text-amber-400">
                    {msg.senderName || "Player"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="whitespace-pre-wrap font-sans text-xs text-foreground">
                  {msg.content}
                </p>

                {/* Emoji reactions & picker */}
                <div className="mt-1.5 flex flex-wrap items-center gap-1">
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(
                        msg.reactions.reduce((acc, r) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => onToggleReaction(msgId, emoji)}
                          className="flex items-center gap-1 border border-muted bg-background px-1.5 py-0.5 font-mono text-[10px] hover:border-foreground"
                        >
                          <span>{emoji}</span>
                          <span>{count}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Reaction Toolbar */}
                  <div className="hidden group-hover:flex items-center gap-1 ml-auto">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => onToggleReaction(msgId, emoji)}
                        className="text-xs hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <span className="inline-block size-2 animate-bounce rounded-full bg-emerald-400"></span>
            <span>{typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Composer */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t-4 border-foreground bg-muted/40 p-3 dark:border-ring"
      >
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder={`Message #${roomName || "channel"}...`}
          className="flex-1 border-2 border-foreground bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:border-ring"
        />
        <Button type="submit" size="sm" className="font-mono text-xs">
          <IconSend className="size-4 mr-1" />
          SEND
        </Button>
      </form>
    </div>
  );
}
