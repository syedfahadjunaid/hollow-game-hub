"use server";

import { apiRequest, ApiError } from "@/lib/api-client";

export interface IAchievement {
  id: string;
  title: string;
  description: string;
  category?: string;
  icon?: string;
  earnedAt?: string;
}

export interface IUserAchievementsResponse {
  total: number;
  earnedCount: number;
  earned: IAchievement[];
  locked: IAchievement[];
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Failed to fetch achievements";
}

/** Get all achievement definitions */
export async function getAchievementsCatalogAction(): Promise<{ success: boolean; catalog?: IAchievement[]; error?: string }> {
  try {
    const response: IAchievement[] = await apiRequest("/api/achievements", { method: "GET" });
    return { success: true, catalog: response };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

/** Get user's earned and locked achievements */
export async function getMyAchievementsAction(): Promise<{ success: boolean; data?: IUserAchievementsResponse; error?: string }> {
  try {
    const response: IUserAchievementsResponse = await apiRequest("/api/achievements/me", { method: "GET" });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}
