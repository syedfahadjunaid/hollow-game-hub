import {
  getNotificationsAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
  deleteNotificationAction,
  seedNotificationsAction,
  NotificationItem,
  NotificationsResponse,
} from "@/app/actions/notification-actions";

export type { NotificationItem, NotificationsResponse };

/** Fetch user notifications from backend via server action */
export async function fetchNotifications(limit = 20, unreadOnly = false): Promise<NotificationsResponse> {
  const res = await getNotificationsAction(limit, unreadOnly);
  return res.data || { notifications: [], unreadCount: 0 };
}

/** Fetch unread count from backend */
export async function fetchUnreadCount(): Promise<number> {
  const res = await getNotificationsAction(1, true);
  return res.data?.unreadCount ?? 0;
}

/** Mark notification as read */
export async function markNotificationRead(id: string): Promise<NotificationItem | null> {
  const res = await markNotificationReadAction(id);
  return (res.data as NotificationItem) || null;
}

/** Mark all notifications as read */
export async function markAllNotificationsRead(): Promise<{ success: boolean }> {
  const res = await markAllNotificationsReadAction();
  return { success: res.success };
}

/** Delete a notification */
export async function deleteNotification(id: string): Promise<{ success: boolean }> {
  const res = await deleteNotificationAction(id);
  return { success: res.success };
}

/** Seed demo notifications for testing */
export async function seedDemoNotifications(): Promise<{ message: string; items: NotificationItem[] }> {
  const res = await seedNotificationsAction();
  return (res.data as { message: string; items: NotificationItem[] }) || { message: "", items: [] };
}
