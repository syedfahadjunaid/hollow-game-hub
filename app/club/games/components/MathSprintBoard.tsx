"use client";

import { useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";

interface MathSprintBoardProps {
  view: {
    question?: string | null;
    index?: number;
    total?: number;
    correctCount?: number;
    result?: string;
    message?: string;
    expected?: number;
  };
  onMove: (payload: { answer: number }) => void;
  isSubmitting: boolean;
  done: boolean;
}

export function MathSprintBoard({ view, onMove, isSubmitting, done }: MathSprintBoardProps) {
  const [answer, setAnswer] = useState("");
  const index = view.index || 1;
  const total = view.total || 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(answer);
    if (isNaN(num) || answer.trim() === "" || isSubmitting || done) return;
    onMove({ answer: num });
    setAnswer("");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">MATH SPRINT</Badge>
          <Badge variant="secondary">Question {Math.min(index, total)} / {total}</Badge>
        </div>
        <CardTitle className="text-xl">Speed Math Challenge</CardTitle>
        <CardDescription>{view.message || "Solve the expression fast"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Math Expression Display */}
        <div className="p-4 sm:p-6 bg-muted/60 border-2 border-primary/30 w-full text-center rounded">
          <span className="text-2xl sm:text-4xl font-mono font-extrabold tracking-wider break-all">
            {view.question || "..."}
          </span>
        </div>

        {/* Answer Form */}
        {!done && (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xs">
            <Input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer..."
              disabled={isSubmitting}
              className="text-center text-lg font-mono"
            />
            <Button type="submit" disabled={answer.trim() === "" || isSubmitting}>
              ENTER
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
