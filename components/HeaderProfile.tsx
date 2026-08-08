"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/8bit/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/8bit/dropdown-menu";
import { Badge } from "@/components/ui/8bit/badge";
import { getCurrentUserAction, logoutAction } from "@/app/actions/auth-actions";
import { getMyProgressionAction, IPlayerProgression } from "@/app/actions/progression-actions";
import { IconLogout, IconUser, IconFlame, IconSparkles } from "@tabler/icons-react";
import toast from "react-hot-toast";

interface IUser {
  id?: string;
  email?: string;
  displayName?: string;
  role?: string;
}

export default function HeaderProfile() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [progression, setProgression] = useState<IPlayerProgression | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, progRes] = await Promise.all([
          getCurrentUserAction(),
          getMyProgressionAction(),
        ]);

        if (userRes.success && userRes.user) {
          setUser(userRes.user);
        }
        if (progRes.success && progRes.progression) {
          setProgression(progRes.progression);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleLogout() {
    try {
      await logoutAction();
      toast.success("Signed out successfully");
      router.push("/auth/login");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  }

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Player";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {/* Live XP Level & Streak Counter */}
      {progression && (
        <div className="hidden sm:flex items-center gap-2">
          {progression.streak > 0 && (
            <Badge variant="outline" className="gap-1 border-amber-500/50 bg-amber-500/10 text-amber-300 font-mono text-xs">
              <IconFlame className="size-3.5 text-amber-500 fill-amber-500" />
              <span>{progression.streak}d</span>
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1 bg-purple-900/40 border-purple-500/40 text-purple-200 font-mono text-xs">
            <IconSparkles className="size-3.5 text-purple-400" />
            <span>LVL {progression.level}</span>
          </Badge>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none">
            <Avatar className="size-7 shrink-0 transition-transform hover:scale-105 sm:size-8 cursor-pointer">
              <AvatarImage
                src="https://8bitcn.com/images/pixelized-8bitcnorc.jpg"
                alt={`@${displayName}`}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || (loading ? "Loading..." : "Guest Gamer")}
              </p>
              {progression && (
                <div className="mt-2 text-[11px] font-mono text-muted-foreground space-y-0.5">
                  <p>Level: <strong className="text-primary">{progression.level}</strong> ({progression.xp} XP)</p>
                  <p>Daily Streak: 🔥 {progression.streak} days</p>
                </div>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user ? (
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <IconLogout className="mr-2 size-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => router.push("/auth/login")}
              className="cursor-pointer"
            >
              <IconUser className="mr-2 size-4" />
              <span>Sign In</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
