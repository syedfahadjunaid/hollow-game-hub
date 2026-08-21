"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  IconSwords,
  IconTrophy,
  IconFlame,
  IconShield,
  IconPlus,
  IconLogin,
  IconCrown,
} from "@tabler/icons-react";
import { toast } from "sonner";

import {
  createPvPLobbyAction,
  joinPvPLobbyAction,
  getPvPLeaderboardAction,
  getPvPProfileAction,
  IPvPRating,
} from "@/app/actions/multiplayer-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/8bit/back-button";

export default function PvPHubPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<IPvPRating | null>(null);
  const [leaderboard, setLeaderboard] = useState<IPvPRating[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const [selectedGame, setSelectedGame] = useState("rps");
  const [selectedRounds, setSelectedRounds] = useState(5);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    const [profileRes, lbRes] = await Promise.all([
      getPvPProfileAction(),
      getPvPLeaderboardAction(15),
    ]);

    if (profileRes.success && profileRes.profile) {
      setProfile(profileRes.profile);
    }
    if (lbRes.success && lbRes.leaderboard) {
      setLeaderboard(lbRes.leaderboard);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateLobby = () => {
    startTransition(async () => {
      const res = await createPvPLobbyAction(selectedGame, selectedRounds);
      if (res.success && res.lobby) {
        toast.success(`Match Lobby Created! Code: ${res.lobby.code}`);
        router.push(`/club/pvp/${res.lobby.code}`);
      } else {
        toast.error("Could not create lobby", { description: res.error });
      }
    });
  };

  const handleJoinLobby = () => {
    if (!joinCode.trim()) {
      toast.error("Please enter a room code.");
      return;
    }

    startTransition(async () => {
      const res = await joinPvPLobbyAction(joinCode.trim().toUpperCase());
      if (res.success && res.lobby) {
        toast.success(`Joined Lobby ${res.lobby.code}!`);
        router.push(`/club/pvp/${res.lobby.code}`);
      } else {
        toast.error("Could not join lobby", { description: res.error });
      }
    });
  };

  const getTierInfo = (rating: number) => {
    if (rating >= 1500) return { name: "DIAMOND", color: "text-cyan-400 border-cyan-500/50 bg-cyan-500/10" };
    if (rating >= 1300) return { name: "GOLD", color: "text-amber-400 border-amber-500/50 bg-amber-500/10" };
    if (rating >= 1100) return { name: "SILVER", color: "text-slate-300 border-slate-400/50 bg-slate-500/10" };
    return { name: "BRONZE", color: "text-amber-600 border-amber-700/50 bg-amber-700/10" };
  };

  const tier = getTierInfo(profile?.rating || 1000);
  const totalMatches = (profile?.wins || 0) + (profile?.losses || 0) + (profile?.draws || 0);
  const winRate = totalMatches > 0 ? Math.round(((profile?.wins || 0) / totalMatches) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 sm:p-6 border-2 border-foreground dark:border-ring shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BackButton href="/club/main-menu" />
            <Image
              src="/images/pixel-heart.gif"
              alt="Heart"
              width={24}
              height={24}
              className="size-6 object-contain pixelated"
              unoptimized
            />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide font-mono uppercase">
              Real-Time PvP Arena
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Climb the competitive Elo ladders in 1v1 duels, earn bonus coins, and prove your supremacy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`font-mono text-xs ${tier.color}`}>
            RANK: {tier.name}
          </Badge>
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 font-mono text-xs font-bold">
            <IconFlame className="size-3.5" />
            <span>{profile?.winStreak || 0} STREAK</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player Stats & Quick Match Controls */}
        <div className="space-y-6 lg:col-span-1">
          {/* Elo & Rating Card */}
          <Card className="border-2 border-foreground dark:border-ring">
            <CardHeader className="space-y-1 pb-3">
              <span className="text-xs text-muted-foreground font-mono uppercase">Competitive Standings</span>
              <div className="flex items-baseline justify-between">
                <CardTitle className="text-2xl font-black font-mono tracking-wider">
                  {profile?.rating || 1000} <span className="text-xs font-normal text-muted-foreground">ELO</span>
                </CardTitle>
                <span className="text-xs text-muted-foreground font-mono">
                  Peak: {profile?.peakRating || 1000}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-muted/40 border border-border">
                  <span className="text-[10px] text-muted-foreground font-mono block">WINS</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">{profile?.wins || 0}</span>
                </div>
                <div className="p-2 bg-muted/40 border border-border">
                  <span className="text-[10px] text-muted-foreground font-mono block">LOSSES</span>
                  <span className="text-sm font-bold font-mono text-rose-400">{profile?.losses || 0}</span>
                </div>
                <div className="p-2 bg-muted/40 border border-border">
                  <span className="text-[10px] text-muted-foreground font-mono block">WIN RATE</span>
                  <span className="text-sm font-bold font-mono text-amber-400">{winRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Custom Match */}
          <Card>
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
                <IconPlus className="size-4 text-amber-400" />
                <span>Host PvP Duel</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Create a private room and share the 6-character code with your rival.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground">Select Game:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "rps", label: "Rock Paper Scissors" },
                    { id: "math-sprint", label: "Math Duel" },
                  ].map((g) => (
                    <Button
                      key={g.id}
                      size="sm"
                      variant={selectedGame === g.id ? "default" : "secondary"}
                      onClick={() => setSelectedGame(g.id)}
                      className="text-[11px] font-mono h-8"
                    >
                      {g.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground">Rounds to Win:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 7].map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant={selectedRounds === r ? "default" : "secondary"}
                      onClick={() => setSelectedRounds(r)}
                      className="text-xs font-mono h-7"
                    >
                      {r} Rounds
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                variant="default"
                disabled={isPending}
                onClick={handleCreateLobby}
                className="w-full font-mono text-xs h-9 flex items-center justify-center gap-2"
              >
                <IconSwords className="size-4" />
                <span>{isPending ? "Creating..." : "Create Duel Room"}</span>
              </Button>
            </CardContent>
          </Card>

          {/* Join Lobby with Code */}
          <Card>
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
                <IconLogin className="size-4 text-cyan-400" />
                <span>Join by Room Code</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Enter your opponent&apos;s 6-character room code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. A9B2X7"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-background border-2 border-foreground dark:border-ring text-center font-mono font-bold tracking-widest text-sm uppercase focus:outline-hidden"
                />
                <Button
                  variant="default"
                  disabled={isPending || joinCode.length < 6}
                  onClick={handleJoinLobby}
                  className="font-mono text-xs"
                >
                  Join
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Global PvP Leaderboard */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-2 border-foreground dark:border-ring">
            <CardHeader className="space-y-1 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-black font-mono flex items-center gap-2">
                  <IconTrophy className="size-5 text-amber-400" />
                  <span>Global Gladiator Leaderboard</span>
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  TOP 15
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Highest ranked duelists across all PvP arenas.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {leaderboard.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground font-mono text-xs">
                  No duelists recorded yet. Be the first to claim the #1 rank!
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {leaderboard.map((duelist, idx) => {
                    const rank = idx + 1;
                    const duelistTier = getTierInfo(duelist.rating);
                    return (
                      <div
                        key={duelist.userId || idx}
                        className={`p-3 sm:p-4 flex items-center justify-between gap-3 ${
                          rank === 1 ? "bg-amber-500/5" : rank === 2 ? "bg-slate-500/5" : rank === 3 ? "bg-amber-700/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 text-center font-mono font-black text-sm">
                            {rank === 1 ? (
                              <IconCrown className="size-5 text-amber-400 mx-auto" />
                            ) : rank === 2 ? (
                              <IconShield className="size-5 text-slate-300 mx-auto" />
                            ) : rank === 3 ? (
                              <IconShield className="size-5 text-amber-600 mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">#{rank}</span>
                            )}
                          </div>

                          <div>
                            <span className="font-mono text-sm font-bold block">
                              {duelist.username || duelist.email || `Player ${duelist.userId.slice(-4)}`}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                              <span>{duelist.wins}W / {duelist.losses}L</span>
                              {duelist.winStreak > 1 && (
                                <span className="text-amber-400 font-bold">🔥 {duelist.winStreak} Streak</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <Badge className={`font-mono text-[10px] hidden sm:inline-flex ${duelistTier.color}`}>
                            {duelistTier.name}
                          </Badge>
                          <div>
                            <span className="font-mono text-base font-black text-amber-400 block">
                              {duelist.rating}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">ELO</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
