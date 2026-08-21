"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getGamesAction, getMyScoresAction } from "@/app/actions/game-actions";
import { IGameInfo, IMyScore } from "@/lib/games/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/8bit/badge";
import { BackButton } from "@/components/ui/8bit/back-button";
import { IconDeviceGamepad2, IconTrophy, IconSparkles } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

const GAME_ICONS: Record<string, string> = {
  "number-guess": "🔢",
  "rock-paper-scissors": "🪨",
  "word-scramble": "🔤",
  "math-sprint": "⚡",
  "trivia-quiz": "❓",
  "riddle": "🧩",
  "wordle": "🟩",
  "hangman": "🪓",
};

export default function GamesCatalogPage() {
  const [games, setGames] = useState<IGameInfo[]>([]);
  const [myScores, setMyScores] = useState<Record<string, IMyScore>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [gamesRes, scoresRes] = await Promise.all([
        getGamesAction(),
        getMyScoresAction(),
      ]);

      if (gamesRes.success && gamesRes.games) {
        setGames(gamesRes.games);
      } else {
        toast.error(gamesRes.error || "Failed to load mini-games catalog");
      }

      if (scoresRes.success && scoresRes.scores) {
        const scoreMap: Record<string, IMyScore> = {};
        scoresRes.scores.forEach((s) => {
          scoreMap[s.gameSlug] = s;
        });
        setMyScores(scoreMap);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-primary/20 pb-4">
        <div className="flex items-center gap-3">
          <BackButton href="/club/main-menu" />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <IconDeviceGamepad2 className="size-8 text-primary" />
              <span>Mini-Games Arena</span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Select a retro mini-game, challenge AI, earn XP, and climb the leaderboard!
            </p>
          </div>
        </div>

        <Link href="/club/dashboard">
          <Button variant="secondary" size="sm" className="gap-2">
            <IconTrophy className="size-4 text-amber-400" />
            <span>Leaderboards</span>
          </Button>
        </Link>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse h-56 flex flex-col justify-between">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-2/3 mb-2" />
                <div className="h-4 bg-muted rounded w-full" />
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
          {games.map((game) => {
            const score = myScores[game.slug];
            const icon = GAME_ICONS[game.slug] || "🎮";

            return (
              <Card
                key={game.slug}
                className="flex flex-col justify-between hover:border-primary/80 transition-all duration-200 border-2"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-3xl">{icon}</span>
                    <div className="flex gap-1">
                      {game.generated && (
                        <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 gap-1 text-[10px]">
                          <IconSparkles className="size-3" />
                          <span>AI</span>
                        </Badge>
                      )}
                      {score && (
                        <Badge variant="outline" className="text-amber-400 border-amber-500/50 text-[10px]">
                          Best: {score.bestScore}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold">{game.name}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed line-clamp-3">
                    {game.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <Link href={`/club/games/${game.slug}`} className="w-full block">
                    <Button className="w-full gap-2 font-bold tracking-wider">
                      <IconDeviceGamepad2 className="size-4" />
                      <span>PLAY GAME</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
