"use server";

import { apiRequest, ApiError } from "@/lib/api-client";

export interface IPlayerProgression {
  level: number;
  xp: number;
  streak: number;
  longestStreak?: number;
  xpToNextLevel?: number;
  progressPct?: number;
}

export interface IXPLeaderboardEntry {
  userId: string;
  username?: string;
  email?: string;
  level: number;
  xp: number;
  streak: number;
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Failed to fetch progression data";
}

/** Get current user's XP, Level, and Streak */
export async function getMyProgressionAction(): Promise<{ success: boolean; progression?: IPlayerProgression; error?: string }> {
  try {
    const response: IPlayerProgression = await apiRequest("/api/progression/me", { method: "GET" });
    return { success: true, progression: response };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

/** Get top players by XP/Level */
export async function getProgressionLeaderboardAction(limit = 10): Promise<{ success: boolean; leaderboard?: IXPLeaderboardEntry[]; error?: string }> {
  try {
    const response: IXPLeaderboardEntry[] = await apiRequest(`/api/progression/leaderboard?limit=${limit}`, { method: "GET" });
    return { success: true, leaderboard: response };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}
