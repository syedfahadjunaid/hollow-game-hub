"use client";

import { useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";

interface RiddleBoardProps {
  view: {
    riddle?: string;
    attemptsLeft?: number;
    hint?: string;
    aiGenerated?: boolean;
    result?: string;
    message?: string;
    answer?: string;
  };
  onMove: (payload: { guess: string }) => void;
  isSubmitting: boolean;
  done: boolean;
}

export function RiddleBoard({ view, onMove, isSubmitting, done }: RiddleBoardProps) {
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
          <Badge variant="outline">RIDDLE ME THIS</Badge>
          <div className="flex gap-2">
            {view.aiGenerated && <Badge variant="secondary" className="bg-purple-900/60 text-purple-200">🤖 AI GENERATED</Badge>}
            <Badge variant="secondary">Attempts Left: {attemptsLeft}</Badge>
          </div>
        </div>
        <CardTitle className="text-xl">Solve the Mystery</CardTitle>
        <CardDescription>{view.message || "Enter your answer to the riddle"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Riddle Display */}
        <div className="p-5 bg-muted/60 border-2 border-primary/30 w-full text-center rounded italic">
          <p className="text-lg leading-relaxed font-serif">
            "{view.riddle || "Loading riddle..."}"
          </p>
        </div>

        {/* Hint Box (if unlocked) */}
        {view.hint && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/40 text-amber-300 w-full rounded text-sm text-center">
            💡 <strong>HINT:</strong> {view.hint}
          </div>
        )}

        {/* Answer Input */}
        {!done && (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
            <Input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Your answer..."
              disabled={isSubmitting}
              className="text-center font-mono"
            />
            <Button type="submit" disabled={!guess.trim() || isSubmitting}>
              SUBMIT
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
