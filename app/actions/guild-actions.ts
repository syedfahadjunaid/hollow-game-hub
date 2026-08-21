"use server";

import { apiRequest, ApiError } from "@/lib/api-client";

export interface IGuildMember {
  id: string;
  _id?: string;
  name?: string;
  email?: string;
  level?: number;
  role: "leader" | "officer" | "member";
}

export interface IGuild {
  id: string;
  _id?: string;
  name: string;
  tag: string;
  description: string;
  emblem: string;
  leaderId: string;
  officerIds: string[];
  memberIds: string[];
  isPublic: boolean;
  minLevel: number;
  level: number;
  xp: number;
  vaultCoins: number;
  perks: string[];
  members?: IGuildMember[];
  memberCount?: number;
}

export interface IGuildChatMessage {
  id: string;
  _id?: string;
  guildId: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: "text" | "announcement" | "system";
  createdAt: string;
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Failed to complete guild action.";
}

/**
 * Get the guild the current user belongs to (if any)
 */
export async function getMyGuildAction(): Promise<{
  success: boolean;
  guild?: IGuild | null;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/guilds/me", { method: "GET" });
    return { success: true, guild: data?.guild || null };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Get detailed info about a specific guild
 */
export async function getGuildDetailsAction(id: string): Promise<{
  success: boolean;
  guild?: IGuild;
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/guilds/${id}`, { method: "GET" });
    return { success: true, guild: data?.guild };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Search and browse public guilds
 */
export async function searchGuildsAction(query = ""): Promise<{
  success: boolean;
  guilds?: IGuild[];
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/guilds/search?query=${encodeURIComponent(query)}`, {
      method: "GET",
    });
    return { success: true, guilds: data?.guilds || [] };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Create a new clan / squad (costs 250 coins)
 */
export async function createGuildAction(payload: {
  name: string;
  tag: string;
  description?: string;
  emblem?: string;
  isPublic?: boolean;
  minLevel?: number;
}): Promise<{
  success: boolean;
  guild?: IGuild;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/guilds", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { success: true, guild: data?.guild };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Join an existing public guild
 */
export async function joinGuildAction(id: string): Promise<{
  success: boolean;
  guild?: IGuild;
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/guilds/${id}/join`, {
      method: "POST",
    });
    return { success: true, guild: data?.guild };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Leave current guild
 */
export async function leaveGuildAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await apiRequest(`/api/guilds/${id}/leave`, {
      method: "POST",
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Deposit coins into guild vault
 */
export async function depositVaultAction(
  id: string,
  amount: number
): Promise<{
  success: boolean;
  vaultCoins?: number;
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/guilds/${id}/vault`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
    return { success: true, vaultCoins: data?.vaultCoins };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Fetch squad chat history
 */
export async function getGuildMessagesAction(id: string): Promise<{
  success: boolean;
  messages?: IGuildChatMessage[];
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/guilds/${id}/chat`, { method: "GET" });
    return { success: true, messages: data?.messages || [] };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Kick a member from the guild (leader only)
 */
export async function kickGuildMemberAction(
  id: string,
  targetUserId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await apiRequest(`/api/guilds/${id}/members/${targetUserId}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}
