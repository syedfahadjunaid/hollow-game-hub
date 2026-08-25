"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/8bit/badge";
import { IconSparkles, IconEye, IconRefresh } from "@tabler/icons-react";

interface MemoryMatchBoardProps {
  view: {
    totalCards?: number;
    matchedIndices?: number[];
    firstFlipped?: { index: number; icon: string } | null;
    lastFlip?: {
      first: { index: number; icon: string };
      second: { index: number; icon: string };
      isMatch: boolean;
    } | null;
    flipsLeft?: number;
    message?: string;
  };
  onMove: (payload: Record<string, any>) => void;
  isSubmitting: boolean;
  done: boolean;
}

export function MemoryMatchBoard({
  view,
  onMove,
  isSubmitting,
  done,
}: MemoryMatchBoardProps) {
  const totalCards = view.totalCards || 8;
  const matched = view.matchedIndices || [];
  const [revealedIcons, setRevealedIcons] = useState<Record<number, string>>({});
  const [temporaryPeek, setTemporaryPeek] = useState<number | null>(null);

  // Keep track of revealed cards for player feedback
  useEffect(() => {
    if (view.firstFlipped) {
      setRevealedIcons((prev) => ({
        ...prev,
        [view.firstFlipped!.index]: view.firstFlipped!.icon,
      }));
      setTemporaryPeek(view.firstFlipped.index);
    } else if (view.lastFlip) {
      setRevealedIcons((prev) => ({
        ...prev,
        [view.lastFlip!.first.index]: view.lastFlip!.first.icon,
        [view.lastFlip!.second.index]: view.lastFlip!.second.icon,
      }));
      setTemporaryPeek(null);
    }
  }, [view.firstFlipped, view.lastFlip]);

  const handleCardClick = (index: number) => {
    if (done || isSubmitting || matched.includes(index) || temporaryPeek === index) return;
    onMove({ cardIndex: index });
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-card border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs bg-primary/10 border-primary/40 font-mono">
            🎴 Memory Flip
          </Badge>
          <Badge
            variant="secondary"
            className={`font-mono text-xs ${
              (view.flipsLeft ?? 12) <= 3
                ? "bg-red-500/20 text-red-400 border-red-500/40"
                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
            }`}
          >
            Flips Left: {view.flipsLeft ?? 12}
          </Badge>
        </div>
        <CardTitle className="text-xl font-extrabold tracking-tight mt-2 flex items-center justify-center gap-2">
          <span>Find All 4 Pairs</span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-mono">
          {view.message || "Flip cards to reveal hidden retro artifacts and match all 4 pairs!"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* 4x2 or 2x4 Grid of Cards */}
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: totalCards }).map((_, idx) => {
            const isMatched = matched.includes(idx);
            const isFirstSelected = view.firstFlipped?.index === idx;
            const isSecondInLastFlip =
              view.lastFlip &&
              (view.lastFlip.first.index === idx || view.lastFlip.second.index === idx);
            const isFlipped = isMatched || isFirstSelected || isSecondInLastFlip;
            const icon = revealedIcons[idx] || (isFirstSelected ? view.firstFlipped?.icon : "❓");

            return (
              <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                disabled={done || isSubmitting || isMatched || isFirstSelected}
                className={`h-24 sm:h-28 flex flex-col items-center justify-center text-3xl sm:text-4xl font-bold transition-all duration-200 border-2 rounded-none font-mono select-none ${
                  isMatched
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[2px_2px_0px_0px_rgba(16,185,129,0.5)]"
                    : isFlipped
                    ? "bg-primary/20 border-primary text-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                    : "bg-muted/80 hover:bg-muted border-border hover:border-primary/60 text-muted-foreground hover:-translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]"
                }`}
              >
                {isFlipped ? (
                  <span className="animate-in fade-in zoom-in-75 duration-150">{icon}</span>
                ) : (
                  <span className="text-xl opacity-40 font-mono">#{idx + 1}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress Bar & Matched Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-t border-border pt-3">
          <div>
            Matched: <span className="text-primary font-bold">{matched.length / 2} / 4 Pairs</span>
          </div>
          <div>
            Status:{" "}
            <span className={done ? (matched.length >= 8 ? "text-emerald-400 font-bold" : "text-red-400 font-bold") : "text-amber-400"}>
              {done ? (matched.length >= 8 ? "VICTORY" : "GAME OVER") : "PLAYING"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
