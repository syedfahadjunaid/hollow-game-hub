"use client";

import { useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";

interface NumberGuessBoardProps {
  view: {
    min?: number;
    max?: number;
    attemptsLeft?: number;
    message?: string;
    result?: string;
  };
  onMove: (payload: { guess: number }) => void;
  isSubmitting: boolean;
  done: boolean;
}

export function NumberGuessBoard({ view, onMove, isSubmitting, done }: NumberGuessBoardProps) {
  const [guess, setGuess] = useState("");
  const attemptsLeft = view.attemptsLeft ?? 7;
  const min = view.min ?? 1;
  const max = view.max ?? 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(guess);
    if (isNaN(num) || num < min || num > max || isSubmitting || done) return;
    onMove({ guess: num });
    setGuess("");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">NUMBER GUESS</Badge>
          <Badge variant="secondary">Attempts Left: {attemptsLeft}</Badge>
        </div>
        <CardTitle className="text-xl">Guess the Secret Number</CardTitle>
        <CardDescription>{view.message || `Number is between ${min} and ${max}`}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Status / Hint Display */}
        {view.result && (
          <div
            className={`p-4 border-2 w-full text-center rounded text-lg font-bold font-mono ${
              view.result === "higher"
                ? "bg-sky-500/20 border-sky-500 text-sky-300"
                : view.result === "lower"
                ? "bg-purple-500/20 border-purple-500 text-purple-300"
                : view.result === "correct"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                : "bg-destructive/20 border-destructive text-destructive-foreground"
            }`}
          >
            {view.result === "higher" && "⬆️ HIGHER!"}
            {view.result === "lower" && "⬇️ LOWER!"}
            {view.result === "correct" && "🎉 CORRECT!"}
            {view.result === "out-of-attempts" && "❌ GAME OVER"}
          </div>
        )}

        {/* Input Form */}
        {!done && (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xs">
            <Input
              type="number"
              min={min}
              max={max}
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder={`${min} - ${max}`}
              disabled={isSubmitting}
              className="text-center font-mono text-lg"
            />
            <Button type="submit" disabled={!guess || isSubmitting}>
              GUESS
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
