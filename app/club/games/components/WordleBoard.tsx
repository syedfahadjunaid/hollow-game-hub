"use client";

import { useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";

interface WordleGuess {
  guess: string;
  feedback: ("correct" | "present" | "absent")[];
}

interface WordleBoardProps {
  view: {
    length?: number;
    attemptsLeft?: number;
    guesses?: WordleGuess[];
    message?: string;
    result?: string;
    answer?: string;
  };
  onMove: (payload: { guess: string }) => void;
  isSubmitting: boolean;
  done: boolean;
}

export function WordleBoard({ view, onMove, isSubmitting, done }: WordleBoardProps) {
  const [guess, setGuess] = useState("");
  const guesses = view.guesses || [];
  const maxAttempts = 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.length !== 5 || isSubmitting || done) return;
    onMove({ guess: guess.toLowerCase() });
    setGuess("");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">WORDLE</Badge>
          <Badge variant="secondary">Attempts Left: {view.attemptsLeft ?? (maxAttempts - guesses.length)}</Badge>
        </div>
        <CardTitle className="text-xl">5-Letter Word Challenge</CardTitle>
        <CardDescription>{view.message || "Guess the hidden 5-letter gaming word"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Grid of 6 rows x 5 columns */}
        <div className="grid grid-rows-6 gap-1.5 sm:gap-2 w-full max-w-[280px] sm:max-w-xs">
          {Array.from({ length: maxAttempts }).map((_, rowIndex) => {
            const rowGuess = guesses[rowIndex];
            return (
              <div key={rowIndex} className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {Array.from({ length: 5 }).map((_, colIndex) => {
                  let letter = "";
                  let statusStyle = "border-2 border-primary/30 bg-background text-foreground";

                  if (rowGuess) {
                    letter = rowGuess.guess[colIndex]?.toUpperCase() || "";
                    const fb = rowGuess.feedback?.[colIndex];
                    if (fb === "correct") {
                      statusStyle = "bg-emerald-600 border-emerald-400 text-white font-bold";
                    } else if (fb === "present") {
                      statusStyle = "bg-amber-500 border-amber-300 text-white font-bold";
                    } else {
                      statusStyle = "bg-muted border-muted-foreground/30 text-muted-foreground";
                    }
                  }

                  return (
                    <div
                      key={colIndex}
                      className={`h-11 sm:h-12 w-full flex items-center justify-center text-base sm:text-lg uppercase font-mono transition-all ${statusStyle}`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Input Form */}
        {!done && (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xs mt-2">
            <Input
              value={guess}
              onChange={(e) => setGuess(e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 5))}
              placeholder="5 letters..."
              maxLength={5}
              disabled={isSubmitting}
              className="text-center tracking-widest uppercase font-mono"
            />
            <Button type="submit" disabled={guess.length !== 5 || isSubmitting}>
              {isSubmitting ? "..." : "GUESS"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
