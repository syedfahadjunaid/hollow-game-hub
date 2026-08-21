"use server";

import { apiRequest, ApiError } from "@/lib/api-client";

export interface IPvPPlayer {
  userId: string;
  name: string;
  avatarUrl?: string;
  isReady: boolean;
  score: number;
}

export interface IPvPLobby {
  code: string;
  gameSlug: string;
  status: "waiting" | "in_progress" | "completed" | "abandoned";
  hostId: string;
  players: IPvPPlayer[];
  currentRound: number;
  maxRounds: number;
  winnerId?: string | null;
  matchId?: string | null;
  createdAt: string;
}

export interface IPvPRating {
  userId: string;
  username?: string;
  email?: string;
  rating: number;
  peakRating: number;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestWinStreak: number;
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Failed to complete multiplayer action.";
}

/**
 * Create a new PvP match lobby
 */
export async function createPvPLobbyAction(
  gameSlug = "rps",
  maxRounds = 5
): Promise<{
  success: boolean;
  lobby?: IPvPLobby;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/multiplayer/lobby", {
      method: "POST",
      body: JSON.stringify({ gameSlug, maxRounds }),
    });
    return { success: true, lobby: data?.lobby };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Join an existing PvP lobby by 6-char room code
 */
export async function joinPvPLobbyAction(code: string): Promise<{
  success: boolean;
  lobby?: IPvPLobby;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/multiplayer/lobby/join", {
      method: "POST",
      body: JSON.stringify({ code: code.toUpperCase() }),
    });
    return { success: true, lobby: data?.lobby };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Get lobby details by code
 */
export async function getPvPLobbyAction(code: string): Promise<{
  success: boolean;
  lobby?: IPvPLobby;
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/multiplayer/lobby/${code.toUpperCase()}`, {
      method: "GET",
    });
    return { success: true, lobby: data?.lobby };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Get top PvP gladiators leaderboard
 */
export async function getPvPLeaderboardAction(limit = 10): Promise<{
  success: boolean;
  leaderboard?: IPvPRating[];
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/multiplayer/leaderboard?limit=${limit}`, {
      method: "GET",
    });
    return { success: true, leaderboard: data?.leaderboard || [] };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Get user PvP profile and Elo stats
 */
export async function getPvPProfileAction(userId?: string): Promise<{
  success: boolean;
  profile?: IPvPRating;
  error?: string;
}> {
  try {
    const endpoint = userId ? `/api/multiplayer/profile/${userId}` : "/api/multiplayer/profile/me";
    const data = await apiRequest(endpoint, { method: "GET" });
    return { success: true, profile: data?.profile };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}
