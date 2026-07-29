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
import { getCurrentUserAction, logoutAction } from "@/app/actions/auth-actions";
import { IconLogout, IconUser } from "@tabler/icons-react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await getCurrentUserAction();
        if (res.success && res.user) {
          setUser(res.user);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="size-10 shrink-0 transition-transform hover:scale-105 sm:size-12 cursor-pointer">
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
            {user?.role && (
              <span className="mt-1 inline-block text-[10px] text-primary font-mono uppercase">
                Role: {user.role}
              </span>
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
  );
}
