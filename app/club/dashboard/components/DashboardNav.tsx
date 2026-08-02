"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconDeviceGamepad2,
  IconLayoutDashboard,
  IconMessageCircle,
  IconTrophy,
  IconSwords,
  IconAward,
} from "@tabler/icons-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Main Menu", url: "/club/main-menu", icon: IconDeviceGamepad2 },
  { title: "Games Arena", url: "/club/games", icon: IconSwords },
  { title: "Badges & Trophies", url: "/club/achievements", icon: IconAward },
  { title: "AI Chat", url: "/club/chat", icon: IconMessageCircle },
  { title: "Dashboard & Stats", url: "/club/dashboard", icon: IconLayoutDashboard },
  { title: "Leaderboards", url: "/club/dashboard", icon: IconTrophy },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={pathname === item.url || pathname.startsWith(item.url + "/")}>
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
