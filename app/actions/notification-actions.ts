"use server";

import { apiRequest, ApiError } from "@/lib/api-client";

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "achievement" | "level_up" | "game" | "system" | "forum";
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Notification action failed";
}

export async function getNotificationsAction(limit = 20, unreadOnly = false): Promise<{ success: boolean; data: NotificationsResponse; error?: string }> {
  try {
    const res = (await apiRequest(`/api/notifications?limit=${limit}&unreadOnly=${unreadOnly}`)) || { notifications: [], unreadCount: 0 };
    return { success: true, data: res as NotificationsResponse };
  } catch (error) {
    return { success: false, error: errorMessage(error), data: { notifications: [], unreadCount: 0 } };
  }
}

export async function markNotificationReadAction(id: string) {
  try {
    const res = await apiRequest(`/api/notifications/${id}/read`, { method: "PATCH" });
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function markAllNotificationsReadAction() {
  try {
    const res = await apiRequest("/api/notifications/read-all", { method: "PATCH" });
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function deleteNotificationAction(id: string) {
  try {
    const res = await apiRequest(`/api/notifications/${id}`, { method: "DELETE" });
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function seedNotificationsAction() {
  try {
    const res = await apiRequest("/api/notifications/seed", { method: "POST" });
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}
