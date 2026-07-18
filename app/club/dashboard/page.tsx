import Link from "next/link";
import {
  IconDeviceGamepad2,
  IconLayoutDashboard,
  IconMessageCircle,
  IconSettings,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import ChartBarMultiple from "@/components/ui/8bit/blocks/chart-bar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

import data from "./data.json";

const items = [
  {
    title: "Main Menu",
    url: "/club/main-menu",
    icon: IconDeviceGamepad2,
  },
  {
    title: "Dashboard",
    url: "/club/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    title: "Chat",
    url: "/club/chat",
    icon: IconMessageCircle,
  },
  {
    title: "Leaderboard",
    url: "#",
    icon: IconTrophy,
  },
  {
    title: "Players",
    url: "#",
    icon: IconUsers,
  },
  {
    title: "Settings",
    url: "#",
    icon: IconSettings,
  },
];

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-screen w-full border">
        <Sidebar className="retro border-foreground border-r-4 dark:border-ring">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <span className="flex size-8 shrink-0 items-center justify-center bg-foreground text-background dark:bg-ring dark:text-background">
                <IconDeviceGamepad2 className="size-5" />
              </span>
              <span className="truncate text-xs font-semibold">
                Hollow Game Hub
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <h1 className="text-lg font-semibold tracking-tight md:text-xl">
                    Player Dashboard
                  </h1>
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                    Hub activity and season performance at a glance.
                  </p>
                </div>
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active players over the last 6 months</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartBarMultiple />
                    </CardContent>
                  </Card>
                </div>

                <DataTable data={data} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
