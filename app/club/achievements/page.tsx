"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyAchievementsAction, IAchievement, IUserAchievementsResponse } from "@/app/actions/achievement-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/8bit/badge";
import { Progress } from "@/components/ui/8bit/progress";
import { IconAward, IconLock, IconCheck, IconArrowLeft, IconTrophy } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

export default function AchievementsPage() {
  const [data, setData] = useState<IUserAchievementsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "earned" | "locked">("all");

  useEffect(() => {
    async function loadAchievements() {
      setLoading(true);
      const res = await getMyAchievementsAction();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        toast.error(res.error || "Failed to load achievements");
      }
      setLoading(false);
    }
    loadAchievements();
  }, []);

  const total = data?.total || 0;
  const earnedCount = data?.earnedCount || 0;
  const pct = total > 0 ? Math.round((earnedCount / total) * 100) : 0;

  const earnedList = data?.earned || [];
  const lockedList = data?.locked || [];

  const displayList: Array<IAchievement & { isEarned: boolean }> = [
    ...earnedList.map((a) => ({ ...a, isEarned: true })),
    ...lockedList.map((a) => ({ ...a, isEarned: false })),
  ].filter((item) => {
    if (filter === "earned") return item.isEarned;
    if (filter === "locked") return !item.isEarned;
    return true;
  });

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-primary/20 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/club/main-menu">
            <Button variant="outline" size="sm" className="gap-2">
              <IconArrowLeft className="size-4" />
              <span>Menu</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <IconAward className="size-8 text-amber-400" />
              <span>Badges & Achievements</span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Unlock retro trophies by mastering mini-games, maintaining streaks, and scoring big!
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

      {/* Overview Card */}
      {data && (
        <Card className="w-full border-2 border-primary/30 bg-card">
          <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="size-12 sm:size-16 rounded flex items-center justify-center bg-amber-500/20 border-2 border-amber-500 text-amber-300 shrink-0">
                <IconAward className="size-8 sm:size-10" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Collector Progress</h2>
                <p className="text-xs text-muted-foreground">
                  You have unlocked <strong className="text-foreground">{earnedCount}</strong> of <strong className="text-foreground">{total}</strong> achievements.
                </p>
              </div>
            </div>

            <div className="w-full md:w-72 flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span>Completion Rate</span>
                <span>{pct}%</span>
              </div>
              <Progress value={pct} className="h-3 sm:h-4" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="text-xs"
        >
          All ({total})
        </Button>
        <Button
          variant={filter === "earned" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("earned")}
          className="gap-1 text-xs"
        >
          <IconCheck className="size-3.5 text-emerald-400" />
          <span>Unlocked ({earnedCount})</span>
        </Button>
        <Button
          variant={filter === "locked" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("locked")}
          className="gap-1 text-xs"
        >
          <IconLock className="size-3.5 text-muted-foreground" />
          <span>Locked ({total - earnedCount})</span>
        </Button>
      </div>

      {/* Badges Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse h-36" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-2">
          {displayList.map((badge) => (
            <Card
              key={badge.id}
              className={`flex flex-col justify-between border-2 transition-all ${
                badge.isEarned
                  ? "border-amber-500/60 bg-amber-950/10 shadow-lg shadow-amber-500/5"
                  : "border-muted/40 opacity-60 bg-muted/20"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-3xl">{badge.icon || (badge.isEarned ? "🏆" : "🔒")}</span>
                  {badge.isEarned ? (
                    <Badge variant="default" className="bg-emerald-600 gap-1 text-[10px]">
                      <IconCheck className="size-3" />
                      <span>UNLOCKED</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-[10px] gap-1">
                      <IconLock className="size-3" />
                      <span>LOCKED</span>
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base font-bold">{badge.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed mt-1">
                  {badge.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-[10px] font-mono text-muted-foreground">
                {badge.isEarned && badge.earnedAt ? (
                  <span>Unlocked: {new Date(badge.earnedAt).toLocaleDateString()}</span>
                ) : (
                  <span>Complete criteria to unlock</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
