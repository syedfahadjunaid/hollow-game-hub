"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";
import { IconDeviceGamepad2, IconRobot, IconUser } from "@tabler/icons-react";

interface TicTacToeBoardProps {
  view: {
    board?: Array<"X" | "O" | null>;
    serverMove?: number | null;
    winner?: "X" | "O" | "draw" | null;
    message?: string;
  };
  onMove: (payload: Record<string, any>) => void;
  isSubmitting: boolean;
  done: boolean;
}

export function TicTacToeBoard({
  view,
  onMove,
  isSubmitting,
  done,
}: TicTacToeBoardProps) {
  const board = view.board || Array(9).fill(null);

  const handleCellClick = (index: number) => {
    if (done || isSubmitting || board[index] !== null) return;
    onMove({ cellIndex: index });
  };

  const getWinnerBadge = () => {
    if (!view.winner) return null;
    if (view.winner === "X") {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs font-mono">
          🎉 Player (X) Victory! +50 pts
        </Badge>
      );
    }
    if (view.winner === "O") {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/40 text-xs font-mono">
          🤖 AI (O) Wins!
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs font-mono">
        🤝 Stalemate Draw! +20 pts
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs bg-primary/10 border-primary/40 font-mono">
            ⭕ 3x3 Tic-Tac-Toe
          </Badge>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1 text-cyan-400">
              <IconUser className="size-3" /> You (X)
            </span>
            <span>vs</span>
            <span className="flex items-center gap-1 text-rose-400">
              <IconRobot className="size-3" /> AI (O)
            </span>
          </div>
        </div>
        <CardTitle className="text-xl font-extrabold tracking-tight mt-2 flex items-center justify-center gap-2">
          <span>Grid Showdown</span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-mono">
          {view.message || "Click an empty square to place your X and line up 3 in a row!"}
        </CardDescription>
        {getWinnerBadge() && <div className="mt-2 flex justify-center">{getWinnerBadge()}</div>}
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[320px] mx-auto p-2 bg-muted/40 border-2 border-border">
          {board.map((cell, idx) => {
            const isLastAiMove = view.serverMove === idx;
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={done || isSubmitting || cell !== null}
                className={`h-24 flex items-center justify-center text-4xl font-extrabold font-mono transition-all select-none border-2 rounded-none ${
                  cell === "X"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[2px_2px_0px_0px_rgba(6,182,212,0.4)]"
                    : cell === "O"
                    ? `bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-[2px_2px_0px_0px_rgba(244,63,94,0.4)] ${
                        isLastAiMove ? "animate-pulse" : ""
                      }`
                    : done
                    ? "bg-muted/30 border-border opacity-40 cursor-not-allowed"
                    : "bg-card hover:bg-primary/20 border-border hover:border-primary text-transparent hover:text-primary/40 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] cursor-pointer"
                }`}
              >
                {cell || (done ? "" : "·")}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-around text-xs font-mono text-muted-foreground border-t border-border pt-3">
          <div className="flex items-center gap-1.5">
            <span className="size-3 bg-cyan-400 inline-block" />
            <span>Player (X)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 bg-rose-400 inline-block" />
            <span>Minimax AI (O)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
