"use server";

import { apiRequest, ApiError } from "@/lib/api-client";
import { IGameInfo, IGameSessionStart, IGameMoveResponse, IMyScore, IGlobalLeaderboardEntry } from "@/lib/games/types";

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "An error occurred while communicating with the game server";
}

/** Get list of playable mini-games */
export async function getGamesAction(): Promise<{ success: boolean; games?: IGameInfo[]; error?: string }> {
  try {
    const response: IGameInfo[] = await apiRequest("/api/games", { method: "GET" });
    return { success: true, games: response };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

/** Start a new game session */
export async function startGameAction(slug: string): Promise<{ success: boolean; session?: IGameSessionStart; error?: string }> {
  try {
    const response: IGameSessionStart = await apiRequest(`/api/games/${encodeURIComponent(slug)}/start`, {
      method: "POST",
    });
    return { success: true, session: response };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

/** Submit a move/guess for an active session */
export async function submitMoveAction(
  sessionId: string,
  payload: Record<string, any>
): Promise<{ success: boolean; result?: IGameMoveResponse; error?: string }> {
  try {
    const response: IGameMoveResponse = await apiRequest(`/api/games/sessions/${encodeURIComponent(sessionId)}/move`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { success: true, result: response };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

/** Get user's high scores across all games */
export async function getMyScoresAction(): Promise<{ success: boolean; scores?: IMyScore[]; error?: string }> {
  try {
    const response: IMyScore[] = await apiRequest("/api/games/scores/me", { method: "GET" });
    return { success: true, scores: response };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

/** Get per-game leaderboard */
export async function getGameLeaderboardAction(slug: string, limit = 10): Promise<{ success: boolean; leaderboard?: any[]; error?: string }> {
  try {
    const response = await apiRequest(`/api/games/${encodeURIComponent(slug)}/leaderboard?limit=${limit}`, {
      method: "GET",
    });
    return { success: true, leaderboard: response };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

/** Get global cross-game leaderboard */
export async function getGlobalLeaderboardAction(limit = 10): Promise<{ success: boolean; leaderboard?: IGlobalLeaderboardEntry[]; error?: string }> {
  try {
    const response: IGlobalLeaderboardEntry[] = await apiRequest(`/api/games/leaderboard/global?limit=${limit}`, {
      method: "GET",
    });
    return { success: true, leaderboard: response };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

/** Get Daily Challenge Status */
export async function getDailyStatusAction(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await apiRequest("/api/games/daily", { method: "GET" });
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

/** Start Daily Challenge */
export async function startDailyAction(): Promise<{ success: boolean; session?: IGameSessionStart; error?: string }> {
  try {
    const response: IGameSessionStart = await apiRequest("/api/games/daily/start", { method: "POST" });
    return { success: true, session: response };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

/** Get Daily Challenge Leaderboard */
export async function getDailyLeaderboardAction(date?: string, limit = 10): Promise<{ success: boolean; leaderboard?: any[]; error?: string }> {
  try {
    const query = date ? `?date=${encodeURIComponent(date)}&limit=${limit}` : `?limit=${limit}`;
    const response: any = await apiRequest(`/api/games/daily/leaderboard${query}`, { method: "GET" });
    const leaderboard = Array.isArray(response)
      ? response
      : Array.isArray(response?.entries)
      ? response.entries
      : [];
    return { success: true, leaderboard };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}
