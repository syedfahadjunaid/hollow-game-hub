"use client";

import { useEffect, useState } from "react";
import { getGlobalLeaderboardAction, getDailyLeaderboardAction, getMyScoresAction } from "@/app/actions/game-actions";
import { getProgressionLeaderboardAction, IXPLeaderboardEntry } from "@/app/actions/progression-actions";
import { IGlobalLeaderboardEntry, IMyScore } from "@/lib/games/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/8bit/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/8bit/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/8bit/table";
import { Badge } from "@/components/ui/8bit/badge";
import { IconTrophy, IconFlame, IconSparkles, IconDeviceGamepad2 } from "@tabler/icons-react";
import { playTabSound } from "@/lib/sound";

const MEDALS = ["🥇", "🥈", "🥉"];

export function LiveLeaderboards() {
  const [globalData, setGlobalData] = useState<IGlobalLeaderboardEntry[]>([]);
  const [xpData, setXpData] = useState<IXPLeaderboardEntry[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [myScores, setMyScores] = useState<IMyScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboards() {
      setLoading(true);
      const [gRes, xRes, dRes, sRes] = await Promise.all([
        getGlobalLeaderboardAction(10),
        getProgressionLeaderboardAction(10),
        getDailyLeaderboardAction(undefined, 10),
        getMyScoresAction(),
      ]);

      if (gRes.success && gRes.leaderboard) {
        setGlobalData(Array.isArray(gRes.leaderboard) ? gRes.leaderboard : []);
      }
      if (xRes.success && xRes.leaderboard) {
        setXpData(Array.isArray(xRes.leaderboard) ? xRes.leaderboard : []);
      }
      if (dRes.success && dRes.leaderboard) {
        const items = Array.isArray(dRes.leaderboard)
          ? dRes.leaderboard
          : Array.isArray((dRes.leaderboard as any)?.entries)
          ? (dRes.leaderboard as any).entries
          : [];
        setDailyData(items);
      }
      if (sRes.success && sRes.scores) {
        setMyScores(Array.isArray(sRes.scores) ? sRes.scores : []);
      }
      setLoading(false);
    }
    loadLeaderboards();
  }, []);

  return (
    <Card className="w-full border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <IconTrophy className="size-6 text-amber-400" />
              <span>Live Hub Leaderboards</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Top performing players across global scores, level progression, and daily challenges.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full mb-4 gap-1 sm:gap-2 h-auto p-1 bg-muted/40">
            <TabsTrigger value="global" onClick={playTabSound} className="text-xs sm:text-sm py-2">
              Global Scores
            </TabsTrigger>
            <TabsTrigger value="xp" onClick={playTabSound} className="text-xs sm:text-sm py-2">
              Level & XP
            </TabsTrigger>
            <TabsTrigger value="daily" onClick={playTabSound} className="text-xs sm:text-sm py-2">
              Daily Ranking
            </TabsTrigger>
            <TabsTrigger value="my" onClick={playTabSound} className="text-xs sm:text-sm py-2">
              My Scores
            </TabsTrigger>
          </TabsList>

          {/* Global Leaderboard Tab */}
          <TabsContent value="global">
            <div className="overflow-x-auto w-full border border-border/40 rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14 sm:w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Total Score</TableHead>
                    <TableHead className="text-right">Plays</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-6">Loading global rankings...</TableCell></TableRow>
                  ) : !Array.isArray(globalData) || globalData.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No scores recorded yet</TableCell></TableRow>
                  ) : (
                    globalData.map((row: any, idx) => {
                      const userId = row.userId || row.user?.id || row.user?._id || idx;
                      const username = row.username || row.user?.name || row.user?.email?.split("@")[0] || row.email?.split("@")[0] || `Player ${idx + 1}`;
                      return (
                        <TableRow key={userId}>
                          <TableCell className="font-mono font-bold">
                            {idx < 3 ? <span className="text-lg">{MEDALS[idx]}</span> : `#${idx + 1}`}
                          </TableCell>
                          <TableCell className="font-semibold text-xs sm:text-sm">
                            {username}
                          </TableCell>
                          <TableCell className="text-right font-mono text-primary font-bold text-xs sm:text-sm">{row.totalScore ?? row.totalBest ?? 0}</TableCell>
                          <TableCell className="text-right font-mono text-xs sm:text-sm">{row.totalPlays || row.plays || "-"}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* XP & Level Leaderboard Tab */}
          <TabsContent value="xp">
            <div className="overflow-x-auto w-full border border-border/40 rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14 sm:w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-center">Level</TableHead>
                    <TableHead className="text-right">Total XP</TableHead>
                    <TableHead className="text-right">Streak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-6">Loading XP rankings...</TableCell></TableRow>
                  ) : !Array.isArray(xpData) || xpData.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No progression data recorded yet</TableCell></TableRow>
                  ) : (
                    xpData.map((row: any, idx) => {
                      const userId = row.userId || row.user?.id || row.user?._id || idx;
                      const username = row.username || row.user?.name || row.user?.email?.split("@")[0] || row.email?.split("@")[0] || `Player ${idx + 1}`;
                      return (
                        <TableRow key={userId}>
                          <TableCell className="font-mono font-bold">
                            {idx < 3 ? <span className="text-lg">{MEDALS[idx]}</span> : `#${idx + 1}`}
                          </TableCell>
                          <TableCell className="font-semibold text-xs sm:text-sm">
                            {username}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="bg-purple-900/50 text-purple-200 text-[10px] sm:text-xs">LVL {row.level}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-purple-300 font-bold text-xs sm:text-sm">{row.xp} XP</TableCell>
                          <TableCell className="text-right font-mono text-amber-400 font-bold text-xs sm:text-sm">🔥 {row.streak}d</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Daily Leaderboard Tab */}
          <TabsContent value="daily">
            <div className="overflow-x-auto w-full border border-border/40 rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14 sm:w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Today's Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-6">Loading daily challenge rankings...</TableCell></TableRow>
                  ) : !Array.isArray(dailyData) || dailyData.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No daily attempts recorded today</TableCell></TableRow>
                  ) : (
                    dailyData.map((row: any, idx) => {
                      const userId = row.userId || row.user?.id || row.user?._id || idx;
                      const username = row.username || row.user?.name || row.user?.email?.split("@")[0] || row.email?.split("@")[0] || `Player ${idx + 1}`;
                      return (
                        <TableRow key={userId}>
                          <TableCell className="font-mono font-bold">
                            {idx < 3 ? <span className="text-lg">{MEDALS[idx]}</span> : `#${idx + 1}`}
                          </TableCell>
                          <TableCell className="font-semibold text-xs sm:text-sm">
                            {username}
                          </TableCell>
                          <TableCell className="text-right font-mono text-emerald-400 font-bold text-xs sm:text-sm">{row.score}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* My High Scores Tab */}
          <TabsContent value="my">
            <div className="overflow-x-auto w-full border border-border/40 rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game</TableHead>
                    <TableHead className="text-right">Best Score</TableHead>
                    <TableHead className="text-right">Total Score</TableHead>
                    <TableHead className="text-right">Plays</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-6">Loading your scores...</TableCell></TableRow>
                  ) : !Array.isArray(myScores) || myScores.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">You haven't played any games yet! Head to Games Arena to start.</TableCell></TableRow>
                  ) : (
                    myScores.map((score) => (
                      <TableRow key={score.gameSlug}>
                        <TableCell className="font-bold capitalize text-xs sm:text-sm">{score.gameSlug.replace(/-/g, " ")}</TableCell>
                        <TableCell className="text-right font-mono text-amber-400 font-bold text-xs sm:text-sm">{score.bestScore}</TableCell>
                        <TableCell className="text-right font-mono text-xs sm:text-sm">{score.totalScore}</TableCell>
                        <TableCell className="text-right font-mono text-xs sm:text-sm">{score.plays}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
