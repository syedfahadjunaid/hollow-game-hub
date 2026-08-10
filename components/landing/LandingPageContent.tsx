"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/8bit/badge";
import { Button } from "@/components/ui/8bit/button";
import { Progress } from "@/components/ui/8bit/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { playClickSound, playCorrectSound, playLevelUp } from "@/lib/sound";

import {
  IconDeviceGamepad2,
  IconBrain,
  IconTrophy,
  IconMessages,
  IconFlame,
  IconSparkles,
  IconArrowRight,
  IconUserPlus,
  IconLogin,
  IconCheck,
} from "@tabler/icons-react";

interface LandingPageContentProps {
  mode?: "public" | "club";
  className?: string;
}

const TRIVIA_QUESTIONS = [
  {
    question: "What is the famous Konami Code starting sequence?",
    options: ["Up Up Down Down Left Right Left Right B A", "Up Down Left Right A B A B", "Down Down Up Up B A B A"],
    correct: 0,
  },
  {
    question: "What currency is used in Hollow Knight?",
    options: ["Gold Coins", "Geo", "Rupees"],
    correct: 1,
  },
  {
    question: "Which retro console debuted the Game Boy in 1989?",
    options: ["Sega", "Nintendo", "Atari"],
    correct: 1,
  },
];

const LEADERBOARD_TEASER = [
  { rank: "01", name: "PixelMaster_99", score: "42,850 XP", badge: "LEGEND" },
  { rank: "02", name: "CyberKnight", score: "38,200 XP", badge: "MASTER" },
  { rank: "03", name: "RetroGamer_X", score: "35,640 XP", badge: "PRO" },
  { rank: "04", name: "GigaByte_Zero", score: "31,900 XP", badge: "VETERAN" },
];

const ACHIEVEMENTS_TEASER = [
  { title: "First Blood", desc: "Played your first mini-game", icon: "⚔️" },
  { title: "AI Whisperer", desc: "Asked 10+ questions to AI Assistant", icon: "🧠" },
  { title: "Guild Master", desc: "Created a trending forum thread", icon: "🛡️" },
  { title: "High Scorer", desc: "Top 10 on global leaderboard", icon: "👑" },
];

export default function LandingPageContent({ mode = "public", className }: LandingPageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Micro game state
  const [clickCount, setClickCount] = useState(0);
  const [userXp, setUserXp] = useState(120);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [triviaFeedback, setTriviaFeedback] = useState<string | null>(null);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    // GSAP Entrance Animations
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
      }

      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, delay: 0.2, ease: "back.out(1.5)" }
        );
      }

      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          y: -8,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (statsRef.current && statsRef.current.children) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.3, ease: "power1.out" }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleCoinClick = () => {
    playClickSound();
    const newCount = clickCount + 1;
    const newXp = userXp + 25;
    setClickCount(newCount);
    setUserXp(newXp);

    if (newXp >= level * 200) {
      setLevel((prev) => prev + 1);
      playLevelUp();
    }
  };

  const handleAnswerClick = (index: number) => {
    playClickSound();
    setSelectedAnswer(index);
    const currentQ = TRIVIA_QUESTIONS[triviaIndex];

    if (index === currentQ.correct) {
      playCorrectSound();
      setTriviaFeedback("CORRECT! +50 XP");
      setUserXp((prev) => {
        const updated = prev + 50;
        if (updated >= level * 200) {
          setLevel((l) => l + 1);
          playLevelUp();
        }
        return updated;
      });
    } else {
      setTriviaFeedback("INCORRECT! Try again");
    }
  };

  const handleNextQuestion = () => {
    playClickSound();
    setSelectedAnswer(null);
    setTriviaFeedback(null);
    setTriviaIndex((prev) => (prev + 1) % TRIVIA_QUESTIONS.length);
  };

  return (
    <div className={cn("w-full max-w-6xl mx-auto space-y-8 py-4 px-2 sm:px-4", className)}>
      {/* 1. HERO SECTION */}
      <section ref={heroRef} className="relative w-full overflow-hidden rounded-xl bg-card border-2 border-foreground p-6 sm:p-10 shadow-lg text-center flex flex-col items-center">
        {/* Subtle grid accent background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Top Retro Badge */}
        <div ref={badgeRef} className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
          <Image src="/images/pixel-coin.gif" alt="Pixel Coin" width={16} height={16} className="pixelated" unoptimized />
          <span>v2.0 NEXT-GEN GAMING REALM</span>
          <Image src="/images/pixel-heart.gif" alt="Pixel Heart" width={16} height={16} className="pixelated" unoptimized />
        </div>

        {/* Title & Description */}
        <h1 ref={titleRef} className="relative z-10 text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase">
          Welcome to <span className="text-amber-500 underline decoration-wavy decoration-amber-500/50">Hollow Game Hub</span>
        </h1>
        <p className="relative z-10 max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed mb-6 font-mono">
          The ultimate 8-bit retro arcade & AI power hub. Battle in mini-games, consult our streaming AI Gaming Assistant, complete daily quests, and level up with the gaming community.
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
          {mode === "public" ? (
            <>
              <Button asChild size="lg" className="retro bg-amber-500 text-black hover:bg-amber-400 font-bold px-6">
                <Link href="/auth/login" className="flex items-center gap-2">
                  <IconLogin className="size-5" />
                  <span>ENTER PORTAL (LOGIN)</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="retro font-bold px-6">
                <Link href="/auth/sign-up" className="flex items-center gap-2">
                  <IconUserPlus className="size-5" />
                  <span>CREATE ACCOUNT</span>
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="retro font-bold px-6">
                <Link href="/club/games" className="flex items-center gap-2">
                  <IconDeviceGamepad2 className="size-5" />
                  <span>EXPLORE GAMES</span>
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="lg" className="retro bg-amber-500 text-black hover:bg-amber-400 font-bold px-6">
                <Link href="/club/games" className="flex items-center gap-2">
                  <IconDeviceGamepad2 className="size-5 text-black" />
                  <span>START PLAYING GAMES</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="retro font-bold px-6">
                <Link href="/club/chat" className="flex items-center gap-2">
                  <IconBrain className="size-5 text-amber-500" />
                  <span>ASK AI ASSISTANT</span>
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="retro font-bold px-6">
                <Link href="/club/dashboard" className="flex items-center gap-2">
                  <IconTrophy className="size-5 text-emerald-500" />
                  <span>VIEW PLAYER STATS</span>
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Quick System Badge */}
        <div className="relative z-10 flex items-center justify-center gap-4 text-[10px] sm:text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
            </span>
            SYSTEM ONLINE
          </span>
          <span>•</span>
          <span>GROQ LLM CONNECTED</span>
          <span>•</span>
          <span>RETRO SOUND FX READY</span>
        </div>
      </section>

      {/* 2. PLATFORM STATS BAR */}
      <section ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 text-center p-4 hover:border-amber-500 transition-colors">
          <div className="flex justify-center mb-1 text-amber-500">
            <IconDeviceGamepad2 className="size-6" />
          </div>
          <p className="text-xl sm:text-2xl font-black">1,420+</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-mono">Games Played</p>
        </Card>

        <Card className="border-2 text-center p-4 hover:border-amber-500 transition-colors">
          <div className="flex justify-center mb-1 text-sky-400">
            <IconBrain className="size-6" />
          </div>
          <p className="text-xl sm:text-2xl font-black">98.4%</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-mono">AI Strategy Rate</p>
        </Card>

        <Card className="border-2 text-center p-4 hover:border-amber-500 transition-colors">
          <div className="flex justify-center mb-1 text-emerald-400">
            <IconTrophy className="size-6" />
          </div>
          <p className="text-xl sm:text-2xl font-black">42,900+</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-mono">Total XP Earned</p>
        </Card>

        <Card className="border-2 text-center p-4 hover:border-amber-500 transition-colors">
          <div className="flex justify-center mb-1 text-purple-400">
            <IconFlame className="size-6" />
          </div>
          <p className="text-xl sm:text-2xl font-black">250+</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-mono">Active Guild Members</p>
        </Card>
      </section>

      {/* 3. INTERACTIVE RETRO ARCADE TEASER WIDGET */}
      <section className="border-2 border-amber-500/60 rounded-xl bg-card p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-400 border-amber-500">
                ⚡ LIVE INTERACTIVE ARCADE WIDGET
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">Level {level} Player</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
              Collect Retro XP & Test Your Knowledge Right Now!
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-mono">
              Click the interactive coin below or complete retro gaming trivia to earn instant XP and hear synthesized Web Audio sound FX.
            </p>

            {/* XP Bar */}
            <div className="space-y-1 max-w-sm">
              <div className="flex justify-between text-xs font-mono">
                <span className="flex items-center gap-1">
                  <Image src="/images/pixel-heart.gif" alt="Heart" width={14} height={14} className="pixelated" unoptimized />
                  XP Progression
                </span>
                <span className="text-amber-400 font-bold">{userXp} / {level * 200} XP</span>
              </div>
              <Progress value={Math.min(100, (userXp / (level * 200)) * 100)} className="h-3" />
            </div>

            {/* Click Coin Collector */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleCoinClick}
                className="group relative flex items-center justify-center p-3 bg-amber-500/20 hover:bg-amber-500/30 border-2 border-amber-500 rounded-lg transition-transform active:scale-95 cursor-pointer"
                title="Click to gain +25 XP!"
              >
                <Image
                  src="/images/pixel-coin.gif"
                  alt="Pixel Coin"
                  width={36}
                  height={36}
                  className="pixelated group-hover:scale-110 transition-transform"
                  unoptimized
                />
                <span className="ml-2 font-mono font-bold text-amber-400 text-sm">
                  +25 XP ({clickCount} Coins)
                </span>
              </button>
              <span className="text-[11px] text-muted-foreground font-mono">
                (Click to collect coin!)
              </span>
            </div>
          </div>

          {/* Trivia Card */}
          <Card className="w-full md:w-1/2 border-2 border-border bg-muted/40">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <IconBrain className="size-4 text-amber-400" />
                <span>Retro Gaming Quest Trivia #{triviaIndex + 1}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {TRIVIA_QUESTIONS[triviaIndex].question}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                {TRIVIA_QUESTIONS[triviaIndex].options.map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswerClick(idx)}
                    className={cn(
                      "w-full text-left p-2.5 text-xs font-mono rounded border transition-colors flex items-center justify-between cursor-pointer",
                      selectedAnswer === idx
                        ? idx === TRIVIA_QUESTIONS[triviaIndex].correct
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold"
                          : "bg-destructive/20 border-destructive text-destructive font-bold"
                        : "bg-card hover:bg-accent border-border"
                    )}
                  >
                    <span>{opt}</span>
                    {selectedAnswer === idx && idx === TRIVIA_QUESTIONS[triviaIndex].correct && (
                      <IconCheck className="size-4 text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>

              {triviaFeedback && (
                <div className="flex items-center justify-between pt-2">
                  <span className={cn("text-xs font-bold font-mono", triviaFeedback.includes("CORRECT") ? "text-emerald-400" : "text-destructive")}>
                    {triviaFeedback}
                  </span>
                  <Button size="sm" variant="ghost" onClick={handleNextQuestion} className="text-xs">
                    Next Question ▶
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. FEATURE PILLARS GRID */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight">
            The 4 Pillars of Hollow Game Hub
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono">
            Everything you need for an immersive retro gaming & AI experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Mini-Games */}
          <Card className="border-2 hover:border-amber-500 transition-all flex flex-col justify-between group">
            <CardHeader>
              <div className="size-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <IconDeviceGamepad2 className="size-6" />
              </div>
              <CardTitle className="text-lg">Mini-Games Arena</CardTitle>
              <CardDescription className="text-xs font-mono">
                Arcade catalog featuring retro classics, real-time turn-based inputs, live score tracking, and competitive global leaderboards.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                <span className="bg-muted px-2 py-1 rounded">🐍 Snake Arcade</span>
                <span className="bg-muted px-2 py-1 rounded">🧩 8-Bit Memory Match</span>
                <span className="bg-muted px-2 py-1 rounded">🎯 Quest Trivia</span>
              </div>
              <Button asChild size="sm" variant="outline" className="w-full text-xs">
                <Link href="/club/games" className="flex items-center justify-between">
                  <span>PLAY MINI-GAMES</span>
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pillar 2: AI Gaming Assistant */}
          <Card className="border-2 hover:border-sky-500 transition-all flex flex-col justify-between group">
            <CardHeader>
              <div className="size-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <IconBrain className="size-6" />
              </div>
              <CardTitle className="text-lg">AI Gaming Assistant</CardTitle>
              <CardDescription className="text-xs font-mono">
                Real-time streaming strategy guide powered by Groq LLMs. Get instant boss strategies, game lore answers, build suggestions & speedrun walkthroughs.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                <span className="bg-muted px-2 py-1 rounded">⚡ Groq LLM Streaming</span>
                <span className="bg-muted px-2 py-1 rounded">🛡️ Lore Master</span>
                <span className="bg-muted px-2 py-1 rounded">🏆 Speedrun Tips</span>
              </div>
              <Button asChild size="sm" variant="outline" className="w-full text-xs">
                <Link href="/club/chat" className="flex items-center justify-between">
                  <span>LAUNCH AI CHAT</span>
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pillar 3: Player Progression */}
          <Card className="border-2 hover:border-emerald-500 transition-all flex flex-col justify-between group">
            <CardHeader>
              <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <IconTrophy className="size-6" />
              </div>
              <CardTitle className="text-lg">Player Dashboard & Stats</CardTitle>
              <CardDescription className="text-xs font-mono">
                Track your player level, XP progression, daily quest streaks, health & mana meters, and total achievements in one central hub.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                <span className="bg-muted px-2 py-1 rounded">🔥 Daily Streaks</span>
                <span className="bg-muted px-2 py-1 rounded">📊 High Scores</span>
                <span className="bg-muted px-2 py-1 rounded">👑 Level Perks</span>
              </div>
              <Button asChild size="sm" variant="outline" className="w-full text-xs">
                <Link href="/club/dashboard" className="flex items-center justify-between">
                  <span>VIEW PLAYER DASHBOARD</span>
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pillar 4: Community Guild */}
          <Card className="border-2 hover:border-purple-500 transition-all flex flex-col justify-between group">
            <CardHeader>
              <div className="size-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <IconMessages className="size-6" />
              </div>
              <CardTitle className="text-lg">Community Guild & Forum</CardTitle>
              <CardDescription className="text-xs font-mono">
                Discuss gaming tactics, create discussion threads, upvote community posts, unlock trophies, and connect with fellow gamers.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                <span className="bg-muted px-2 py-1 rounded">💬 Nested Discussions</span>
                <span className="bg-muted px-2 py-1 rounded">🎖️ Unlocked Badges</span>
                <span className="bg-muted px-2 py-1 rounded">⭐ Upvoting System</span>
              </div>
              <Button asChild size="sm" variant="outline" className="w-full text-xs">
                <Link href="/club/forum" className="flex items-center justify-between">
                  <span>VISIT COMMUNITY FORUM</span>
                  <IconArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. LEADERBOARD & ACHIEVEMENTS SPOTLIGHT */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Global Hall of Fame */}
        <Card className="border-2">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <IconTrophy className="size-5 text-amber-500" />
                <span>Global Hall of Fame</span>
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono">TOP PLAYERS</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {LEADERBOARD_TEASER.map((player) => (
              <div key={player.name} className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-amber-400 w-5">{player.rank}</span>
                  <span className="font-semibold">{player.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{player.score}</span>
                  <Badge variant="secondary" className="text-[9px]">{player.badge}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Trophies */}
        <Card className="border-2">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <IconSparkles className="size-5 text-emerald-400" />
                <span>Featured Badges & Trophy Wall</span>
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono">UNLOCKABLE</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 gap-3">
            {ACHIEVEMENTS_TEASER.map((ach) => (
              <div key={ach.title} className="p-2.5 rounded bg-muted/30 border border-border space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{ach.icon}</span>
                  <span className="text-xs font-bold font-mono truncate">{ach.title}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-mono leading-tight">{ach.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* 6. RETRO FOOTER */}
      <footer className="border-t-2 border-border pt-6 pb-2 text-center text-xs text-muted-foreground font-mono space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/club/games" className="hover:text-amber-400 transition-colors">Games</Link>
          <span>•</span>
          <Link href="/club/chat" className="hover:text-amber-400 transition-colors">AI Assistant</Link>
          <span>•</span>
          <Link href="/club/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</Link>
          <span>•</span>
          <Link href="/club/forum" className="hover:text-amber-400 transition-colors">Forum</Link>
          <span>•</span>
          <Link href="/auth/login" className="hover:text-amber-400 transition-colors">Portal Login</Link>
        </div>
        <p className="text-[10px]">
          &copy; 2026 Hollow Game Hub — Built with Next.js 16, React 19 & 8-Bit Web Audio API
        </p>
      </footer>
    </div>
  );
}
