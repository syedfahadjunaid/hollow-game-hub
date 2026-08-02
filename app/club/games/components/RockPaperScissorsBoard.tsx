"use client";

import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";

interface RockPaperScissorsBoardProps {
  view: {
    rounds?: number;
    played?: number;
    wins?: number;
    losses?: number;
    draws?: number;
    yourMove?: string;
    serverMove?: string;
    outcome?: string;
    message?: string;
  };
  onMove: (payload: { move: string }) => void;
  isSubmitting: boolean;
  done: boolean;
}

const MOVE_ICONS: Record<string, string> = {
  rock: "🪨 ROCK",
  paper: "📄 PAPER",
  scissors: "✂️ SCISSORS",
};

export function RockPaperScissorsBoard({ view, onMove, isSubmitting, done }: RockPaperScissorsBoardProps) {
  const rounds = view.rounds || 5;
  const played = view.played || 0;
  const wins = view.wins || 0;
  const losses = view.losses || 0;
  const draws = view.draws || 0;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">ROCK PAPER SCISSORS</Badge>
          <Badge variant="secondary">Round {Math.min(played + 1, rounds)} / {rounds}</Badge>
        </div>
        <CardTitle className="text-xl">Best of {rounds} Showdown</CardTitle>
        <CardDescription>{view.message || "Choose your move against the server"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Scorecard */}
        <div className="flex gap-4">
          <Badge variant="default" className="bg-emerald-600">Wins: {wins}</Badge>
          <Badge variant="destructive">Losses: {losses}</Badge>
          <Badge variant="secondary">Draws: {draws}</Badge>
        </div>

        {/* Previous round resolution visual */}
        {view.yourMove && (
          <div className="flex items-center justify-around w-full p-4 border-2 border-primary/20 bg-muted/40 rounded">
            <div className="text-center">
              <span className="text-xs text-muted-foreground block">YOU</span>
              <span className="text-lg font-bold uppercase">{MOVE_ICONS[view.yourMove] || view.yourMove}</span>
            </div>
            <div className="text-2xl font-black text-primary">VS</div>
            <div className="text-center">
              <span className="text-xs text-muted-foreground block">SERVER</span>
              <span className="text-lg font-bold uppercase">{MOVE_ICONS[view.serverMove || ""] || view.serverMove}</span>
            </div>
          </div>
        )}

        {/* Action Choice Buttons */}
        {!done && (
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
            {(["rock", "paper", "scissors"] as const).map((m) => (
              <Button
                key={m}
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onMove({ move: m })}
                className="h-16 flex flex-col items-center justify-center gap-1 hover:border-primary"
              >
                <span className="text-sm font-bold">{MOVE_ICONS[m]}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
