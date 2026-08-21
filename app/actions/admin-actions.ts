"use server";

import { apiRequest, ApiError } from "@/lib/api-client";

export interface IAdminStats {
  users: {
    total: number;
    banned: number;
    active: number;
  };
  guilds: {
    total: number;
  };
  moderation: {
    openReports: number;
  };
  economy: {
    totalCoins: number;
    totalGems: number;
    totalXp: number;
  };
}

export interface IAdminUser {
  id: string;
  _id?: string;
  name?: string;
  displayName?: string;
  email: string;
  role: "user" | "moderator" | "admin";
  isBanned: boolean;
  banReason?: string | null;
  createdAt: string;
}

export interface IModerationReport {
  id: string;
  _id?: string;
  reporterId: string;
  reportedUserId: string;
  reason: "toxicity" | "spam" | "cheating" | "inappropriate_profile" | "other";
  details: string;
  evidenceUrl?: string | null;
  status: "open" | "investigating" | "resolved" | "dismissed";
  resolutionNotes?: string | null;
  createdAt: string;
  reporter?: { id: string; name?: string; email?: string };
  reportedUser?: { id: string; name?: string; email?: string; isBanned?: boolean };
}

export interface IAuditLog {
  id: string;
  _id?: string;
  actorId: string;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  targetId?: string | null;
  targetType?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Failed to complete admin action.";
}

/**
 * Fetch platform overview analytics
 */
export async function getAdminStatsAction(): Promise<{
  success: boolean;
  stats?: IAdminStats;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/admin/stats", { method: "GET" });
    return { success: true, stats: data?.stats };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Fetch users list with filters and search
 */
export async function getAdminUsersAction(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isBanned?: boolean;
} = {}): Promise<{
  success: boolean;
  users?: IAdminUser[];
  total?: number;
  error?: string;
}> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    if (params.role) query.set("role", params.role);
    if (typeof params.isBanned === "boolean") query.set("isBanned", String(params.isBanned));

    const data = await apiRequest(`/api/admin/users?${query.toString()}`, {
      method: "GET",
    });
    return { success: true, users: data?.users || [], total: data?.total || 0 };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Ban a user account
 */
export async function banUserAction(
  userId: string,
  reason: string,
  durationDays?: number
): Promise<{
  success: boolean;
  user?: IAdminUser;
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/admin/users/${userId}/ban`, {
      method: "POST",
      body: JSON.stringify({ reason, durationDays }),
    });
    return { success: true, user: data?.user };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Unban a user account
 */
export async function unbanUserAction(
  userId: string
): Promise<{
  success: boolean;
  user?: IAdminUser;
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/admin/users/${userId}/unban`, {
      method: "POST",
    });
    return { success: true, user: data?.user };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Change user role (user | moderator | admin)
 */
export async function setUserRoleAction(
  userId: string,
  role: "user" | "moderator" | "admin"
): Promise<{
  success: boolean;
  user?: IAdminUser;
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/admin/users/${userId}/role`, {
      method: "POST",
      body: JSON.stringify({ role }),
    });
    return { success: true, user: data?.user };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Grant coins and gems to a user
 */
export async function grantUserCurrencyAction(
  userId: string,
  payload: { coins?: number; gems?: number; reason?: string }
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await apiRequest(`/api/admin/users/${userId}/grant`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Fetch moderation reports
 */
export async function getAdminReportsAction(
  status?: string
): Promise<{
  success: boolean;
  reports?: IModerationReport[];
  error?: string;
}> {
  try {
    const query = status ? `?status=${status}` : "";
    const data = await apiRequest(`/api/admin/reports${query}`, {
      method: "GET",
    });
    return { success: true, reports: data?.reports || [] };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Resolve or dismiss a moderation report
 */
export async function resolveReportAction(
  reportId: string,
  status: "resolved" | "dismissed",
  resolutionNotes = ""
): Promise<{
  success: boolean;
  report?: IModerationReport;
  error?: string;
}> {
  try {
    const data = await apiRequest(`/api/admin/reports/${reportId}/resolve`, {
      method: "POST",
      body: JSON.stringify({ status, resolutionNotes }),
    });
    return { success: true, report: data?.report };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Fetch administrative and anti-cheat audit logs
 */
export async function getAuditLogsAction(
  limit = 50,
  action?: string
): Promise<{
  success: boolean;
  logs?: IAuditLog[];
  error?: string;
}> {
  try {
    const query = new URLSearchParams();
    query.set("limit", String(limit));
    if (action) query.set("action", action);

    const data = await apiRequest(`/api/admin/audit-logs?${query.toString()}`, {
      method: "GET",
    });
    return { success: true, logs: data?.logs || [] };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}
