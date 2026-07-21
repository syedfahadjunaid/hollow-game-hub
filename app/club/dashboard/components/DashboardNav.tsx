"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconDeviceGamepad2,
  IconLayoutDashboard,
  IconMessageCircle,
  IconSettings,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/**
 * Rendered as a Client Component on purpose.
 *
 * `SidebarMenuButton asChild` uses a Slot that clones its child. When the
 * `<Link>` child is created in a Server Component and passed across the RSC
 * boundary, that clone doesn't survive hydration and the menu items render as
 * empty <li>s. Building the items here keeps them client-side and intact.
 */

const items = [
  { title: "Main Menu", url: "/club/main-menu", icon: IconDeviceGamepad2 },
  { title: "Dashboard", url: "/club/dashboard", icon: IconLayoutDashboard },
  { title: "Chat", url: "/club/chat", icon: IconMessageCircle },
  { title: "Leaderboard", url: "#", icon: IconTrophy },
  { title: "Players", url: "#", icon: IconUsers },
  { title: "Settings", url: "#", icon: IconSettings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={pathname === item.url}>
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
