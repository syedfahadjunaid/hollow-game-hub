"use client";

import React from "react";
import {
  IconHash,
  IconDeviceGamepad2,
  IconSwords,
  IconCode,
  IconUser,
  IconPlus,
} from "@tabler/icons-react";
import { ChatRoom } from "@/hooks/useCommunityChat";

interface RoomListProps {
  rooms: ChatRoom[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onlineCount: number;
}

export function RoomList({
  rooms,
  selectedRoomId,
  onSelectRoom,
  onlineCount,
}: RoomListProps) {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "gamepad":
        return <IconDeviceGamepad2 className="size-4 shrink-0 text-amber-400" />;
      case "swords":
        return <IconSwords className="size-4 shrink-0 text-rose-400" />;
      case "code":
        return <IconCode className="size-4 shrink-0 text-cyan-400" />;
      case "user":
        return <IconUser className="size-4 shrink-0 text-purple-400" />;
      default:
        return <IconHash className="size-4 shrink-0 text-emerald-400" />;
    }
  };

  return (
    <div className="flex h-full flex-col border-4 border-foreground bg-card p-3 dark:border-ring">
      {/* Sidebar Header */}
      <div className="mb-3 flex items-center justify-between border-b-2 border-muted pb-2">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
          CHANNELS
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-green-500">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
          </span>
          {onlineCount} Online
        </span>
      </div>

      {/* Room list */}
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {rooms.map((room) => {
          const roomId = room._id || room.id || room.slug;
          const isSelected = selectedRoomId === roomId;

          return (
            <button
              key={roomId}
              type="button"
              onClick={() => onSelectRoom(roomId)}
              className={`group flex w-full items-center justify-between border-2 p-2 text-left font-mono text-xs transition-all ${
                isSelected
                  ? "border-foreground bg-primary text-primary-foreground font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "border-transparent bg-muted/40 hover:border-muted-foreground/30 hover:bg-muted"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                {getIcon(room.icon)}
                <span className="truncate">{room.name}</span>
              </div>

              {room.type === "public" && (
                <span className="ml-1 text-[10px] text-muted-foreground group-hover:text-foreground">
                  #pub
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
