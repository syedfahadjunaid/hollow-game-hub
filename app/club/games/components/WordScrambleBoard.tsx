"use client";

import { useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";

interface WordScrambleBoardProps {
  view: {
    scrambled?: string;
    length?: number;
    attemptsLeft?: number;
    message?: string;
    result?: string;
    word?: string;
  };
  onMove: (payload: { guess: string }) => void;
  isSubmitting: boolean;
  done: boolean;
}

export function WordScrambleBoard({ view, onMove, isSubmitting, done }: WordScrambleBoardProps) {
  const [guess, setGuess] = useState("");
  const attemptsLeft = view.attemptsLeft ?? 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || isSubmitting || done) return;
    onMove({ guess: guess.trim() });
    setGuess("");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">WORD SCRAMBLE</Badge>
          <Badge variant="secondary">Attempts Left: {attemptsLeft}</Badge>
        </div>
        <CardTitle className="text-xl">Unscramble the Word</CardTitle>
        <CardDescription>{view.message || "Reorder the letters to find the gaming word"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Scrambled Word Display */}
        <div className="p-4 sm:p-6 bg-muted/60 border-2 border-primary/30 w-full text-center rounded">
          <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-widest uppercase break-all">
            {view.scrambled ? view.scrambled.split("").join(" ") : "..."}
          </span>
          {view.length && (
            <span className="block text-xs text-muted-foreground mt-2">({view.length} letters)</span>
          )}
        </div>

        {/* Input Form */}
        {!done && (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xs">
            <Input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Unscrambled word..."
              disabled={isSubmitting}
              className="text-center font-mono uppercase"
            />
            <Button type="submit" disabled={!guess.trim() || isSubmitting}>
              GUESS
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
