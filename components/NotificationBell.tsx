"use client";

import { useEffect, useState, useCallback } from "react";
import {
  IconBell,
  IconCheck,
  IconTrash,
  IconSparkles,
  IconChecklist,
  IconPlus,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/8bit/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/8bit/dropdown-menu";

import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  seedDemoNotifications,
  NotificationItem,
} from "@/lib/notifications-api";
import { playClickSound, playCorrectSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

function getTypeIcon(type: NotificationItem["type"]) {
  switch (type) {
    case "achievement":
      return "🏆";
    case "level_up":
      return "⚡";
    case "game":
      return "🎮";
    case "forum":
      return "💬";
    default:
      return "📢";
  }
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await fetchNotifications(25);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    // Poll notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleMarkRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playClickSound();
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    playCorrectSound();
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    const item = notifications.find((n) => n.id === id);
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (item && !item.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleSeed = async () => {
    playCorrectSound();
    setLoading(true);
    try {
      await seedDemoNotifications();
      await loadNotifications();
    } finally {
      setLoading(false);
    }
  };

  const displayedList =
    filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative retro p-2 flex items-center justify-center cursor-pointer"
          title="Notifications"
          onClick={() => playClickSound()}
        >
          <IconBell className="size-5 text-foreground hover:text-amber-400 transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black border border-black animate-pulse font-mono">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 p-0 border-2 border-foreground bg-popover shadow-xl rounded-lg font-mono text-xs z-50 overflow-hidden"
      >
        {/* Header Bar */}
        <div className="p-3 border-b border-border bg-muted/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconSparkles className="size-4 text-amber-400" />
            <span className="font-bold text-sm uppercase">NOTIFICATIONS</span>
            {unreadCount > 0 && (
              <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500">
                {unreadCount} UNREAD
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSeed}
            disabled={loading}
            className="text-[10px] px-2 h-7 font-mono text-muted-foreground hover:text-foreground"
            title="Generate Demo Notifications"
          >
            <IconPlus className="size-3 mr-1" />
            Seed Demo
          </Button>
        </div>

        {/* Action Controls & Tabs */}
        <div className="p-2 border-b border-border flex items-center justify-between bg-card text-[11px]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                playClickSound();
                setFilter("all");
              }}
              className={cn(
                "px-2 py-1 rounded cursor-pointer transition-colors",
                filter === "all" ? "bg-amber-500 text-black font-bold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              ALL ({notifications.length})
            </button>
            <button
              onClick={() => {
                playClickSound();
                setFilter("unread");
              }}
              className={cn(
                "px-2 py-1 rounded cursor-pointer transition-colors",
                filter === "unread" ? "bg-amber-500 text-black font-bold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              UNREAD ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMarkAllAllRead}
              className="text-[10px] h-6 px-2 text-emerald-400 hover:text-emerald-300"
            >
              <IconChecklist className="size-3 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border">
          {displayedList.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground space-y-2">
              <p className="text-sm">NO NOTIFICATIONS</p>
              <p className="text-[10px]">Play mini-games or unlock achievements to receive notifications!</p>
              <Button size="sm" variant="outline" onClick={handleSeed} className="mt-2 text-xs">
                + Create Demo Notifications
              </Button>
            </div>
          ) : (
            displayedList.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.isRead && handleMarkRead(item.id)}
                className={cn(
                  "p-3 transition-colors flex items-start gap-3 cursor-pointer group hover:bg-accent/50 relative",
                  !item.isRead ? "bg-amber-500/5 font-semibold" : "opacity-80"
                )}
              >
                {/* Type Icon */}
                <span className="text-base shrink-0 select-none mt-0.5">{getTypeIcon(item.type)}</span>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-bold text-foreground group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </p>
                    <span className="text-[9px] text-muted-foreground shrink-0">{timeAgo(item.createdAt)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                    {item.message}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                  {!item.isRead && (
                    <button
                      onClick={(e) => handleMarkRead(item.id, e)}
                      className="p-1 rounded hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                      title="Mark as read"
                    >
                      <IconCheck className="size-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <IconTrash className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  async function handleMarkAllAllRead() {
    await handleMarkAllRead();
  }
}
