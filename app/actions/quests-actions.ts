"use server";

import { apiRequest, ApiError } from "@/lib/api-client";

export interface IQuest {
  id: string;
  _id?: string;
  title: string;
  description: string;
  questType: "daily" | "weekly" | "special";
  targetType: "play" | "win" | "pvp" | "score";
  targetCount: number;
  rewardCoins: number;
  rewardGems: number;
  rewardPassXp: number;
  gameSlug?: string;
}

export interface IUserQuest {
  id: string;
  _id?: string;
  questId: string;
  progress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  expiresAt: string;
  questDetails?: IQuest;
}

export interface IBattlePassTier {
  tier: number;
  requiredXp: number;
  freeReward: {
    type: "coins" | "gems" | "item";
    amount?: number;
    itemSlug?: string;
    description: string;
  };
  premiumReward: {
    type: "coins" | "gems" | "item";
    amount?: number;
    itemSlug?: string;
    description: string;
  };
}

export interface IBattlePassData {
  seasonNumber: number;
  title: string;
  endsAt: string;
  userProgress: {
    currentTier: number;
    currentXp: number;
    isPremium: boolean;
    claimedTiers: {
      free: number[];
      premium: number[];
    };
  };
  tiers: IBattlePassTier[];
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Failed to complete quest action.";
}

/**
 * Fetch daily and weekly quests for current user
 */
export async function getUserQuestsAction(): Promise<{
  success: boolean;
  dailyQuests?: IUserQuest[];
  weeklyQuests?: IUserQuest[];
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/quests", { method: "GET" });
    return {
      success: true,
      dailyQuests: data?.dailyQuests || [],
      weeklyQuests: data?.weeklyQuests || [],
    };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Claim quest completion reward
 */
export async function claimQuestRewardAction(userQuestId: string): Promise<{
  success: boolean;
  reward?: { coins: number; gems: number; passXp: number };
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/quests/claim/${userQuestId}`, {
      method: "POST",
    });
    return { success: true, reward: data?.reward };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Fetch Battle Pass season and user progress
 */
export async function getBattlePassAction(): Promise<{
  success: boolean;
  battlePass?: IBattlePassData;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/quests/battlepass", { method: "GET" });
    return { success: true, battlePass: data?.battlePass };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Upgrade to Premium Battle Pass track
 */
export async function upgradeBattlePassAction(
  currency: "coins" | "gems"
): Promise<{
  success: boolean;
  isPremium?: boolean;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/quests/battlepass/upgrade", {
      method: "POST",
      body: JSON.stringify({ currency }),
    });
    return { success: true, isPremium: data?.isPremium };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Claim reward for an unlocked Battle Pass tier
 */
export async function claimBattlePassTierAction(
  tier: number
): Promise<{
  success: boolean;
  claimedReward?: Record<string, unknown>;
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/quests/battlepass/claim/${tier}`, {
      method: "POST",
    });
    return { success: true, claimedReward: data?.reward };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}
