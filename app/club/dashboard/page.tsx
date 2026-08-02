import { IconDeviceGamepad2 } from "@tabler/icons-react";
import { DashboardHeader } from "@/components/dashboard-header";
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
  SidebarProvider,
} from "@/components/ui/sidebar";

import { DashboardNav } from "./components/DashboardNav";
import { LiveLeaderboards } from "./components/LiveLeaderboards";

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
                <DashboardNav />
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
                    Hub activity, season performance, and live global rankings at a glance.
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

                <div className="px-4 lg:px-6">
                  <LiveLeaderboards />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
