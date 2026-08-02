"use client";

import { useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";

interface HangmanBoardProps {
  view: {
    masked?: string;
    length?: number;
    guessedLetters?: string[];
    wrongLetters?: string[];
    wrongLeft?: number;
    message?: string;
    result?: string;
    word?: string;
  };
  onMove: (payload: { letter?: string; word?: string }) => void;
  isSubmitting: boolean;
  done: boolean;
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export function HangmanBoard({ view, onMove, isSubmitting, done }: HangmanBoardProps) {
  const [wordGuess, setWordGuess] = useState("");
  const wrongLeft = view.wrongLeft ?? 6;
  const guessedLetters = view.guessedLetters || [];

  const handleLetterClick = (char: string) => {
    if (isSubmitting || done || guessedLetters.includes(char)) return;
    onMove({ letter: char });
  };

  const handleWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordGuess.trim() || isSubmitting || done) return;
    onMove({ word: wordGuess.trim().toLowerCase() });
    setWordGuess("");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">HANGMAN</Badge>
          <Badge variant={wrongLeft <= 2 ? "destructive" : "secondary"}>Lives Left: {wrongLeft}</Badge>
        </div>
        <CardTitle className="text-xl">Guess the Gaming Term</CardTitle>
        <CardDescription>{view.message || "Pick letters or guess the full word"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Masked Word Display */}
        <div className="p-4 bg-muted/50 border-2 border-primary/20 w-full text-center rounded">
          <span className="text-3xl font-mono tracking-widest font-bold">
            {view.masked || "_ _ _ _ _"}
          </span>
        </div>

        {/* Keyboard letter buttons */}
        {!done && (
          <div className="flex flex-wrap justify-center gap-1.5 max-w-md">
            {ALPHABET.map((char) => {
              const isUsed = guessedLetters.includes(char);
              return (
                <Button
                  key={char}
                  size="sm"
                  variant={isUsed ? "ghost" : "outline"}
                  disabled={isUsed || isSubmitting}
                  onClick={() => handleLetterClick(char)}
                  className="w-8 h-9 text-xs font-mono uppercase"
                >
                  {char}
                </Button>
              );
            })}
          </div>
        )}

        {/* Full word guess fallback */}
        {!done && (
          <form onSubmit={handleWordSubmit} className="flex gap-2 w-full max-w-xs mt-2">
            <Input
              value={wordGuess}
              onChange={(e) => setWordGuess(e.target.value)}
              placeholder="Full word guess..."
              disabled={isSubmitting}
              className="text-sm font-mono"
            />
            <Button type="submit" size="sm" disabled={!wordGuess.trim() || isSubmitting}>
              SOLVE
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
