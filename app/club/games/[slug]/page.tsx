"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { startGameAction, submitMoveAction } from "@/app/actions/game-actions";
import { IGameSessionStart, IGameMoveResponse } from "@/lib/games/types";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";
import { IconArrowLeft, IconRotateClockwise, IconTrophy, IconAward } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

import { WordleBoard } from "../components/WordleBoard";
import { HangmanBoard } from "../components/HangmanBoard";
import { RockPaperScissorsBoard } from "../components/RockPaperScissorsBoard";
import { TriviaQuizBoard } from "../components/TriviaQuizBoard";
import { RiddleBoard } from "../components/RiddleBoard";
import { MathSprintBoard } from "../components/MathSprintBoard";
import { WordScrambleBoard } from "../components/WordScrambleBoard";
import { NumberGuessBoard } from "../components/NumberGuessBoard";

import {
  playGameStartSound,
  playWinFanfare,
  playLevelUp,
  playCorrectSound,
  playWrongSound,
} from "@/lib/sound";

interface GameRunnerProps {
  params: Promise<{ slug: string }>;
}

export default function GameRunnerPage({ params }: GameRunnerProps) {
  const { slug } = use(params);
  const [session, setSession] = useState<IGameSessionStart | IGameMoveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const initGame = async () => {
    setLoading(true);
    const res = await startGameAction(slug);
    if (res.success && res.session) {
      setSession(res.session);
      playGameStartSound();
    } else {
      toast.error(res.error || `Failed to start game "${slug}"`);
    }
    setLoading(false);
  };

  useEffect(() => {
    initGame();
  }, [slug]);

  const handleMove = async (payload: Record<string, any>) => {
    if (!session || session.done || submitting) return;
    setSubmitting(true);
    const res = await submitMoveAction(session.sessionId, payload);
    setSubmitting(false);

    if (res.success && res.result) {
      const result = res.result;
      setSession(result);

      if (result.done) {
        if (result.progression?.levelUp) {
          playLevelUp();
          toast.success(`🎉 LEVEL UP! You reached Level ${result.progression.level}!`, { duration: 5000 });
        } else if ((result.score && result.score > 0) || result.view?.won || result.view?.correct) {
          playWinFanfare();
        } else {
          playWrongSound();
        }

        if (result.progression?.xpGained && !result.progression.levelUp) {
          toast.success(`+${result.progression.xpGained} XP Earned!`);
        }

        if (result.newAchievements && result.newAchievements.length > 0) {
          result.newAchievements.forEach((ach) => {
            toast.success(`🏆 BADGE UNLOCKED: ${ach.title}!`, { duration: 6000 });
          });
        }
      } else {
        if (result.view?.lastGuessResult === "correct" || result.view?.isCorrect || result.view?.hit) {
          playCorrectSound();
        } else if (result.view?.lastGuessResult === "incorrect" || result.view?.isIncorrect || result.view?.miss) {
          playWrongSound();
        } else {
          playCorrectSound();
        }
      }
    } else {
      playWrongSound();
      toast.error(res.error || "Failed to submit move");
    }
  };

  const renderBoard = () => {
    if (!session) return null;
    const view = session.view || {};

    switch (slug) {
      case "wordle":
        return <WordleBoard view={view} onMove={handleMove} isSubmitting={submitting} done={session.done} />;
      case "hangman":
        return <HangmanBoard view={view} onMove={handleMove} isSubmitting={submitting} done={session.done} />;
      case "rock-paper-scissors":
        return <RockPaperScissorsBoard view={view} onMove={handleMove} isSubmitting={submitting} done={session.done} />;
      case "trivia-quiz":
        return <TriviaQuizBoard view={view} onMove={handleMove} isSubmitting={submitting} done={session.done} />;
      case "riddle":
        return <RiddleBoard view={view} onMove={handleMove} isSubmitting={submitting} done={session.done} />;
      case "math-sprint":
        return <MathSprintBoard view={view} onMove={handleMove} isSubmitting={submitting} done={session.done} />;
      case "word-scramble":
        return <WordScrambleBoard view={view} onMove={handleMove} isSubmitting={submitting} done={session.done} />;
      case "number-guess":
        return <NumberGuessBoard view={view} onMove={handleMove} isSubmitting={submitting} done={session.done} />;
      default:
        return (
          <div className="p-8 text-center bg-muted border border-dashed rounded">
            <p>Unsupported game type: {slug}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-primary/20 pb-4">
        <Link href="/club/games">
          <Button variant="outline" size="sm" className="gap-2">
            <IconArrowLeft className="size-4" />
            <span>Games Arena</span>
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm px-3 py-1 bg-amber-500/20 text-amber-300 border-amber-500/40">
            <IconTrophy className="size-4 mr-1 text-amber-400" />
            <span>Score: {session?.score ?? 0}</span>
          </Badge>
          <Button variant="ghost" size="sm" onClick={initGame} disabled={loading} title="Restart Game">
            <IconRotateClockwise className="size-4" />
          </Button>
        </div>
      </div>

      {/* Main Game Shell */}
      {loading ? (
        <Card className="w-full max-w-lg mx-auto p-12 text-center animate-pulse">
          <CardTitle>Starting Game Session...</CardTitle>
          <CardDescription className="mt-2">Initializing engine state...</CardDescription>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {renderBoard()}

          {/* Game Completion Overlay / Card */}
          {session?.done && (
            <Card className="w-full max-w-lg mx-auto border-2 border-emerald-500/60 bg-emerald-950/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-emerald-400 font-extrabold flex items-center justify-center gap-2">
                  <IconAward className="size-8" />
                  <span>GAME COMPLETED!</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  {session.view?.message || `Final Score: ${session.score} points`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-4 pt-2">
                <Button onClick={initGame} className="gap-2 bg-emerald-600 hover:bg-emerald-700 font-bold">
                  <IconRotateClockwise className="size-4" />
                  <span>PLAY AGAIN</span>
                </Button>
                <Link href="/club/games">
                  <Button variant="outline">GAMES ARENA</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
