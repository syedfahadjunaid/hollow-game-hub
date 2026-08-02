"use client";

import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";

interface TriviaQuizBoardProps {
  view: {
    question?: string;
    options?: string[];
    index?: number;
    total?: number;
    aiGenerated?: boolean;
    result?: string;
    message?: string;
    correctCount?: number;
  };
  onMove: (payload: { optionIndex: number }) => void;
  isSubmitting: boolean;
  done: boolean;
}

export function TriviaQuizBoard({ view, onMove, isSubmitting, done }: TriviaQuizBoardProps) {
  const index = view.index || 1;
  const total = view.total || 5;
  const options = view.options || [];

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">TRIVIA QUIZ</Badge>
          <div className="flex gap-2">
            {view.aiGenerated && <Badge variant="secondary" className="bg-purple-900/60 text-purple-200">🤖 AI GENERATED</Badge>}
            <Badge variant="secondary">Question {index} / {total}</Badge>
          </div>
        </div>
        <CardTitle className="text-xl">Gaming Knowledge Challenge</CardTitle>
        <CardDescription>{view.message || "Select the correct option"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Question Box */}
        <div className="p-4 bg-muted/60 border-2 border-primary/30 w-full text-center rounded">
          <h3 className="text-lg font-medium leading-relaxed">
            {view.question || "Loading question..."}
          </h3>
        </div>

        {/* Options List */}
        {!done && options.length > 0 && (
          <div className="grid grid-cols-1 gap-3 w-full">
            {options.map((opt, optIdx) => (
              <Button
                key={optIdx}
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onMove({ optionIndex: optIdx })}
                className="w-full justify-start text-left py-3 px-4 h-auto whitespace-normal"
              >
                <span className="font-bold mr-3 text-primary">{String.fromCharCode(65 + optIdx)}.</span>
                <span>{opt}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
