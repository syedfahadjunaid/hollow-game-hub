"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import {
  IconTarget,
  IconFlame,
  IconCoins,
  IconDiamond,
  IconStar,
  IconCheck,
  IconSparkles,
  IconCrown,
  IconLock,
} from "@tabler/icons-react";
import { toast } from "sonner";

import {
  getUserQuestsAction,
  claimQuestRewardAction,
  getBattlePassAction,
  upgradeBattlePassAction,
  claimBattlePassTierAction,
  IUserQuest,
  IBattlePassData,
} from "@/app/actions/quests-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/badge";

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState<"quests" | "battlepass">("quests");
  const [dailyQuests, setDailyQuests] = useState<IUserQuest[]>([]);
  const [weeklyQuests, setWeeklyQuests] = useState<IUserQuest[]>([]);
  const [battlePass, setBattlePass] = useState<IBattlePassData | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    const [questsRes, bpRes] = await Promise.all([
      getUserQuestsAction(),
      getBattlePassAction(),
    ]);

    if (questsRes.success) {
      if (questsRes.dailyQuests) setDailyQuests(questsRes.dailyQuests);
      if (questsRes.weeklyQuests) setWeeklyQuests(questsRes.weeklyQuests);
    }
    if (bpRes.success && bpRes.battlePass) {
      setBattlePass(bpRes.battlePass);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaimQuest = (userQuestId: string) => {
    startTransition(async () => {
      const res = await claimQuestRewardAction(userQuestId);
      if (res.success && res.reward) {
        toast.success("Reward Claimed!", {
          description: `+${res.reward.coins} Coins, +${res.reward.gems} Gems, +${res.reward.passXp} Pass XP!`,
        });
        loadData();
      } else {
        toast.error("Could not claim reward", { description: res.error });
      }
    });
  };

  const handleUpgradePass = (currency: "coins" | "gems") => {
    startTransition(async () => {
      const res = await upgradeBattlePassAction(currency);
      if (res.success) {
        toast.success("Upgraded to Premium Battle Pass!", {
          description: "All premium rewards are now unlocked for this season.",
        });
        loadData();
      } else {
        toast.error("Upgrade failed", { description: res.error });
      }
    });
  };

  const handleClaimTier = (tier: number) => {
    startTransition(async () => {
      const res = await claimBattlePassTierAction(tier);
      if (res.success) {
        toast.success(`Tier ${tier} Rewards Claimed!`);
        loadData();
      } else {
        toast.error("Could not claim tier", { description: res.error });
      }
    });
  };

  const renderQuestCard = (uq: IUserQuest) => {
    const q = uq.questDetails;
    if (!q) return null;
    const progressPct = Math.min(100, Math.round((uq.progress / q.targetCount) * 100));
    const canClaim = uq.isCompleted && !uq.isClaimed;

    return (
      <Card key={uq.id || uq._id} className="flex flex-col justify-between">
        <CardHeader className="space-y-1.5 pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              {q.questType}
            </Badge>
            {uq.isClaimed ? (
              <span className="text-xs text-muted-foreground font-mono font-bold flex items-center gap-1">
                <IconCheck className="size-3.5" /> CLAIMED
              </span>
            ) : uq.isCompleted ? (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-mono text-[10px]">
                COMPLETED
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground font-mono">
                {uq.progress} / {q.targetCount}
              </span>
            )}
          </div>
          <CardTitle className="text-sm font-bold font-mono">{q.title}</CardTitle>
          <CardDescription className="text-xs">{q.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          {/* Progress Bar */}
          <div className="w-full bg-muted/60 h-2 border border-border overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                uq.isCompleted ? "bg-emerald-400" : "bg-amber-400"
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Rewards Row & Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 font-mono text-xs">
              {q.rewardCoins > 0 && (
                <span className="text-amber-400 font-bold flex items-center gap-0.5">
                  <IconCoins className="size-3" />+{q.rewardCoins}
                </span>
              )}
              {q.rewardGems > 0 && (
                <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                  <IconDiamond className="size-3" />+{q.rewardGems}
                </span>
              )}
              {q.rewardPassXp > 0 && (
                <span className="text-purple-400 font-bold flex items-center gap-0.5">
                  <IconStar className="size-3" />+{q.rewardPassXp} XP
                </span>
              )}
            </div>

            {canClaim && (
              <Button
                size="sm"
                variant="default"
                disabled={isPending}
                onClick={() => handleClaimQuest(uq.id || uq._id || "")}
                className="text-xs font-mono h-7 bg-amber-500 text-black font-bold animate-bounce"
              >
                CLAIM
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const userProgress = battlePass?.userProgress;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 sm:p-6 border-2 border-foreground dark:border-ring shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Image
              src="/images/pixel-coin.gif"
              alt="Coin"
              width={24}
              height={24}
              className="size-6 object-contain pixelated"
              unoptimized
            />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide font-mono uppercase">
              Quests & Seasonal Battle Pass
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Complete dynamic arcade objectives to level up your Season 1 Battle Pass and earn legendary rewards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userProgress?.isPremium ? (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 font-mono text-xs flex items-center gap-1">
              <IconCrown className="size-3.5" />
              <span>PREMIUM PASS</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="font-mono text-xs">
              FREE PASS
            </Badge>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Button
          variant={activeTab === "quests" ? "default" : "ghost"}
          onClick={() => setActiveTab("quests")}
          className="flex items-center gap-2 font-mono text-xs sm:text-sm"
        >
          <IconTarget className="size-4" />
          <span>Active Quests ({dailyQuests.length + weeklyQuests.length})</span>
        </Button>
        <Button
          variant={activeTab === "battlepass" ? "default" : "ghost"}
          onClick={() => setActiveTab("battlepass")}
          className="flex items-center gap-2 font-mono text-xs sm:text-sm"
        >
          <IconFlame className="size-4" />
          <span>Season 1 Pass (Tier {userProgress?.currentTier || 1})</span>
        </Button>
      </div>

      {/* QUESTS TAB */}
      {activeTab === "quests" && (
        <div className="space-y-6">
          {/* Daily Quests Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono uppercase flex items-center gap-2 text-amber-400">
                <IconFlame className="size-4" />
                <span>Daily Quests</span>
              </h3>
              <span className="text-xs text-muted-foreground font-mono">Refreshes every 24 hours</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyQuests.map(renderQuestCard)}
            </div>
          </div>

          {/* Weekly Quests Section */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono uppercase flex items-center gap-2 text-purple-400">
                <IconSparkles className="size-4" />
                <span>Weekly Objectives</span>
              </h3>
              <span className="text-xs text-muted-foreground font-mono">Refreshes every Monday</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklyQuests.map(renderQuestCard)}
            </div>
          </div>
        </div>
      )}

      {/* BATTLE PASS TAB */}
      {activeTab === "battlepass" && battlePass && (
        <div className="space-y-6">
          {/* Battle Pass Overview Card */}
          <Card className="border-2 border-foreground dark:border-ring">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg sm:text-xl font-black font-mono">
                    {battlePass.title}
                  </CardTitle>
                  <CardDescription className="text-xs font-mono">
                    Climb 20 tiers of arcade rewards by playing games and completing daily quests.
                  </CardDescription>
                </div>

                {!userProgress?.isPremium && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      disabled={isPending}
                      onClick={() => handleUpgradePass("gems")}
                      className="font-mono text-xs h-8 bg-amber-500 text-black font-bold flex items-center gap-1"
                    >
                      <IconCrown className="size-3.5" />
                      <span>Upgrade (50 Gems)</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isPending}
                      onClick={() => handleUpgradePass("coins")}
                      className="font-mono text-xs h-8"
                    >
                      1000 Coins
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-amber-400">
                  CURRENT TIER: {userProgress?.currentTier || 1} / 20
                </span>
                <span className="text-muted-foreground">
                  {userProgress?.currentXp || 0} Pass XP
                </span>
              </div>

              <div className="w-full bg-muted h-3 border border-border overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-amber-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, ((userProgress?.currentTier || 1) / 20) * 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* 20-Tier Showcase Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono uppercase">Season Reward Tracks</h3>

            <div className="space-y-2">
              {battlePass.tiers.map((tierDoc) => {
                const tierNum = tierDoc.tier;
                const isUnlocked = (userProgress?.currentTier || 1) >= tierNum;
                const isFreeClaimed = userProgress?.claimedTiers?.free?.includes(tierNum);
                const isPremClaimed = userProgress?.claimedTiers?.premium?.includes(tierNum);

                return (
                  <div
                    key={tierNum}
                    className={`p-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isUnlocked ? "bg-card border-foreground dark:border-ring" : "bg-muted/30 border-border opacity-70"
                    }`}
                  >
                    {/* Tier Number Indicator */}
                    <div className="flex items-center gap-3">
                      <div className={`size-8 flex items-center justify-center font-mono font-black text-sm border ${
                        isUnlocked ? "bg-amber-500/20 text-amber-400 border-amber-500/50" : "bg-muted text-muted-foreground border-border"
                      }`}>
                        {tierNum}
                      </div>

                      {/* Free Reward */}
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-muted-foreground font-mono uppercase block">
                          FREE REWARD
                        </span>
                        <span className="font-mono text-xs font-bold block">
                          {tierDoc.freeReward.description}
                        </span>
                      </div>
                    </div>

                    {/* Premium Reward */}
                    <div className="space-y-0.5 sm:text-right">
                      <span className="text-[10px] text-amber-400/80 font-mono uppercase block flex items-center sm:justify-end gap-1">
                        <IconCrown className="size-3 text-amber-400" />
                        <span>PREMIUM TRACK</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-400 block">
                        {tierDoc.premiumReward.description}
                      </span>
                    </div>

                    {/* Claim Action */}
                    <div className="flex items-center gap-2 sm:justify-end">
                      {isUnlocked ? (
                        (isFreeClaimed && (!userProgress?.isPremium || isPremClaimed)) ? (
                          <span className="text-xs text-muted-foreground font-mono font-bold flex items-center gap-1">
                            <IconCheck className="size-3.5" /> CLAIMED
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="default"
                            disabled={isPending}
                            onClick={() => handleClaimTier(tierNum)}
                            className="text-xs font-mono h-7"
                          >
                            CLAIM TIER
                          </Button>
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                          <IconLock className="size-3.5" /> Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
