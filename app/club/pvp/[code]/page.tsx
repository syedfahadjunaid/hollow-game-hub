"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconSwords,
  IconCopy,
  IconCheck,
  IconArrowLeft,
  IconFlame,
  IconCoins,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { useSocket } from "@/lib/socket/SocketContext";
import { getPvPLobbyAction, IPvPLobby } from "@/app/actions/multiplayer-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ code: string }>;
}

export default function PvPArenaRoomPage({ params }: Props) {
  const resolvedParams = use(params);
  const lobbyCode = resolvedParams.code.toUpperCase();
  const router = useRouter();
  const { socket } = useSocket();

  const [lobby, setLobby] = useState<IPvPLobby | null>(null);
  const [gameState, setGameState] = useState<"lobby" | "playing" | "game_over">("lobby");
  const [selectedMove, setSelectedMove] = useState<string | null>(null);
  const [moveSubmitted, setMoveSubmitted] = useState(false);
  const [roundResult, setRoundResult] = useState<{
    winnerId: string | null;
    moves: Record<string, string>;
    scores: Record<string, number>;
    round: number;
  } | null>(null);
  const [matchOutcome, setMatchOutcome] = useState<{
    winnerId: string;
    winnerName: string;
    eloDelta: number;
    coinsAwarded: number;
  } | null>(null);

  // Load initial lobby data
  useEffect(() => {
    getPvPLobbyAction(lobbyCode).then((res) => {
      if (res.success && res.lobby) {
        setLobby(res.lobby);
        if (res.lobby.status === "in_progress") setGameState("playing");
        if (res.lobby.status === "completed") setGameState("game_over");
      } else {
        toast.error("Lobby not found");
        router.push("/club/pvp");
      }
    });
  }, [lobbyCode, router]);

  // Socket.IO event listeners for real-time multiplayer arena
  useEffect(() => {
    if (!socket) return;

    socket.emit("pvp_join_lobby", { lobbyCode });

    const handleLobbyUpdated = (data: { lobby: IPvPLobby }) => {
      setLobby(data.lobby);
    };

    const handleGameStarted = (data: { lobby: IPvPLobby }) => {
      setLobby(data.lobby);
      setGameState("playing");
      setRoundResult(null);
      setSelectedMove(null);
      setMoveSubmitted(false);
      toast.success("Match Started! Choose your move!");
    };

    const handleRoundOutcome = (data: {
      winnerId: string | null;
      moves: Record<string, string>;
      scores: Record<string, number>;
      round: number;
    }) => {
      setRoundResult(data);
      setMoveSubmitted(false);
      setSelectedMove(null);
    };

    const handleMatchCompleted = (data: {
      winnerId: string;
      winnerName: string;
      eloDelta: number;
      coinsAwarded: number;
    }) => {
      setMatchOutcome(data);
      setGameState("game_over");
    };

    socket.on("pvp_lobby_updated", handleLobbyUpdated);
    socket.on("pvp_game_started", handleGameStarted);
    socket.on("pvp_round_outcome", handleRoundOutcome);
    socket.on("pvp_match_completed", handleMatchCompleted);

    return () => {
      socket.emit("pvp_leave_lobby", { lobbyCode });
      socket.off("pvp_lobby_updated", handleLobbyUpdated);
      socket.off("pvp_game_started", handleGameStarted);
      socket.off("pvp_round_outcome", handleRoundOutcome);
      socket.off("pvp_match_completed", handleMatchCompleted);
    };
  }, [socket, lobbyCode]);

  const handleToggleReady = () => {
    if (!socket) return;
    socket.emit("pvp_toggle_ready", { lobbyCode });
  };

  const handleStartGame = () => {
    if (!socket) return;
    socket.emit("pvp_start_game", { lobbyCode });
  };

  const handleSubmitMove = (move: string) => {
    if (!socket || moveSubmitted) return;
    setSelectedMove(move);
    setMoveSubmitted(true);
    socket.emit("pvp_submit_move", { lobbyCode, move });
    toast.success(`Locked in ${move.toUpperCase()}! Waiting for opponent...`);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lobbyCode);
    toast.success("Lobby Code copied to clipboard!");
  };

  const isHost = lobby?.players?.[0]?.userId;
  const bothReady = lobby?.players?.length === 2 && lobby.players.every((p) => p.isReady);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/club/pvp">
          <Button variant="ghost" size="sm" className="font-mono text-xs flex items-center gap-1.5">
            <IconArrowLeft className="size-4" />
            <span>Leave Arena</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">ROOM:</span>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopyCode}
            className="font-mono text-xs font-bold tracking-widest flex items-center gap-1.5 h-8"
          >
            <span>{lobbyCode}</span>
            <IconCopy className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* LOBBY / WAITING SCREEN */}
      {gameState === "lobby" && (
        <Card className="border-2 border-foreground dark:border-ring">
          <CardHeader className="text-center space-y-2 pb-4">
            <Badge variant="outline" className="mx-auto font-mono text-xs">
              {lobby?.gameSlug === "rps" ? "ROCK PAPER SCISSORS" : "MATH SPRINT"} • {lobby?.maxRounds || 5} ROUNDS
            </Badge>
            <CardTitle className="text-xl sm:text-2xl font-black font-mono">
              Gladiator Matchmaking Room
            </CardTitle>
            <CardDescription className="text-xs font-mono">
              Share code <strong className="text-amber-400 font-bold">{lobbyCode}</strong> with your rival to duel.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Player Roster Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Player 1 (Host) */}
              <div className="p-4 bg-muted/40 border-2 border-foreground dark:border-ring space-y-2 text-center">
                <span className="text-[10px] text-muted-foreground font-mono uppercase block">PLAYER 1 (HOST)</span>
                <span className="text-base font-bold font-mono block">
                  {lobby?.players?.[0]?.name || "Waiting for Host..."}
                </span>
                <Badge
                  className={`font-mono text-xs ${
                    lobby?.players?.[0]?.isReady
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                      : "bg-zinc-500/20 text-zinc-400"
                  }`}
                >
                  {lobby?.players?.[0]?.isReady ? "READY" : "NOT READY"}
                </Badge>
              </div>

              {/* Player 2 (Challenger) */}
              <div className="p-4 bg-muted/40 border-2 border-foreground dark:border-ring space-y-2 text-center">
                <span className="text-[10px] text-muted-foreground font-mono uppercase block">PLAYER 2 (CHALLENGER)</span>
                <span className="text-base font-bold font-mono block">
                  {lobby?.players?.[1]?.name || "Waiting for Challenger..."}
                </span>
                {lobby?.players?.[1] ? (
                  <Badge
                    className={`font-mono text-xs ${
                      lobby.players[1].isReady
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                        : "bg-zinc-500/20 text-zinc-400"
                    }`}
                  >
                    {lobby.players[1].isReady ? "READY" : "NOT READY"}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground font-mono italic">Waiting for opponent to join...</span>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={handleToggleReady}
                className="w-full sm:flex-1 font-mono text-xs h-10 flex items-center justify-center gap-2"
              >
                <IconCheck className="size-4 text-emerald-400" />
                <span>Toggle Ready State</span>
              </Button>

              {bothReady && (
                <Button
                  variant="default"
                  onClick={handleStartGame}
                  className="w-full sm:flex-1 font-mono text-xs h-10 flex items-center justify-center gap-2 bg-amber-500 text-black font-bold animate-bounce"
                >
                  <IconSwords className="size-4" />
                  <span>START MATCH NOW</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ACTIVE DUEL ARENA SCREEN */}
      {gameState === "playing" && (
        <Card className="border-2 border-foreground dark:border-ring">
          <CardHeader className="text-center space-y-1 pb-2 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">
                ROUND {lobby?.currentRound || 1} OF {lobby?.maxRounds || 5}
              </span>
              <div className="flex items-center gap-2 font-mono text-sm font-bold">
                <span className="text-emerald-400">{lobby?.players?.[0]?.name}: {lobby?.players?.[0]?.score || 0}</span>
                <span>vs</span>
                <span className="text-rose-400">{lobby?.players?.[1]?.name}: {lobby?.players?.[1]?.score || 0}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Previous Round Outcome Banner */}
            {roundResult && (
              <div className="p-3 bg-muted/50 border border-border text-center space-y-1 animate-fadeIn">
                <span className="text-xs font-mono text-amber-400 font-bold block">
                  ROUND {roundResult.round} REVEAL
                </span>
                <p className="text-sm font-mono font-bold">
                  {roundResult.winnerId ? "Point Awarded!" : "Draw round!"}
                </p>
              </div>
            )}

            {/* Move Selection Area for Rock Paper Scissors */}
            <div className="space-y-3 text-center">
              <h3 className="text-sm font-bold font-mono uppercase text-muted-foreground">
                {moveSubmitted ? "Move Submitted! Waiting for opponent..." : "Choose Your Weapon:"}
              </h3>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                {[
                  { id: "rock", label: "ROCK", emoji: "🪨" },
                  { id: "paper", label: "PAPER", emoji: "📄" },
                  { id: "scissors", label: "SCISSORS", emoji: "✂️" },
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant={selectedMove === item.id ? "default" : "secondary"}
                    disabled={moveSubmitted}
                    onClick={() => handleSubmitMove(item.id)}
                    className="flex flex-col items-center justify-center p-4 h-24 border-2 transition-transform hover:scale-105"
                  >
                    <span className="text-3xl mb-1">{item.emoji}</span>
                    <span className="text-xs font-mono font-bold">{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MATCH GAME OVER CEREMONY */}
      {gameState === "game_over" && matchOutcome && (
        <Card className="border-2 border-amber-500/60 bg-amber-500/5 text-center p-6 space-y-6 animate-fadeIn">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <IconFlame className="size-8 text-amber-400" />
              <CardTitle className="text-2xl sm:text-3xl font-black font-mono tracking-wider">
                MATCH VICTORY!
              </CardTitle>
              <IconFlame className="size-8 text-amber-400" />
            </div>
            <CardDescription className="text-sm font-mono">
              Gladiator <strong className="text-amber-400">{matchOutcome.winnerName}</strong> claims the arena crown!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 max-w-sm mx-auto">
            <div className="p-4 bg-card border-2 border-foreground dark:border-ring space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">Elo Rating Delta:</span>
                <span className="text-emerald-400 font-bold">+{matchOutcome.eloDelta} ELO</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">Victory Reward:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <IconCoins className="size-3.5" />
                  <span>+{matchOutcome.coinsAwarded} Coins</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/club/pvp" className="w-full">
                <Button variant="default" className="w-full font-mono text-xs h-9">
                  Return to PvP Hub
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
