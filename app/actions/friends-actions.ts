"use server";

import { apiRequest, ApiError } from "@/lib/api-client";

export interface IFriendUser {
  id: string;
  _id?: string;
  name?: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  level?: number;
  xp?: number;
  isOnline?: boolean;
}

export interface IFriendship {
  id: string;
  _id?: string;
  user1Id: string;
  user2Id: string;
  status: "pending" | "accepted" | "declined" | "blocked";
  initiatedBy: string;
  friend?: IFriendUser;
  createdAt: string;
}

export interface IDirectMessage {
  id: string;
  _id?: string;
  channelId: string;
  senderId: string;
  senderName?: string;
  content: string;
  messageType: "text" | "game_invite" | "system";
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface IDirectChannel {
  id: string;
  _id?: string;
  user1Id: string;
  user2Id: string;
  lastMessageAt?: string;
  unreadCount?: number;
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Failed to complete friend action.";
}

/**
 * Fetch accepted friends list
 */
export async function getFriendsAction(): Promise<{
  success: boolean;
  friends?: IFriendUser[];
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/friends", { method: "GET" });
    return { success: true, friends: data?.friends || [] };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Fetch pending incoming & outgoing friend requests
 */
export async function getPendingRequestsAction(): Promise<{
  success: boolean;
  incoming?: IFriendship[];
  outgoing?: IFriendship[];
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/friends/requests", { method: "GET" });
    return {
      success: true,
      incoming: data?.incoming || [],
      outgoing: data?.outgoing || [],
    };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Send a friend request by email or user ID
 */
export async function sendFriendRequestAction(targetQuery: string): Promise<{
  success: boolean;
  friendship?: IFriendship;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/friends/request", {
      method: "POST",
      body: JSON.stringify({ target: targetQuery }),
    });
    return { success: true, friendship: data?.friendship };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Accept or decline a friend request
 */
export async function respondFriendRequestAction(
  friendshipId: string,
  action: "accept" | "decline"
): Promise<{
  success: boolean;
  friendship?: IFriendship;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/friends/respond", {
      method: "POST",
      body: JSON.stringify({ friendshipId, action }),
    });
    return { success: true, friendship: data?.friendship };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Fetch direct message thread with a friend
 */
export async function getDirectMessagesAction(friendId: string): Promise<{
  success: boolean;
  channel?: IDirectChannel;
  messages?: IDirectMessage[];
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/friends/dm/${friendId}`, { method: "GET" });
    return {
      success: true,
      channel: data?.channel,
      messages: data?.messages || [],
    };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Mark messages in a direct channel as read
 */
export async function markDirectMessagesReadAction(channelId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await apiRequest(`/api/friends/dm/${channelId}/read`, { method: "POST" });
    return { success: true };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Block a user
 */
export async function blockUserAction(targetUserId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await apiRequest("/api/friends/block", {
      method: "POST",
      body: JSON.stringify({ targetUserId }),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}
