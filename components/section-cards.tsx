import {
  IconBolt,
  IconShieldHalf,
  IconTrendingDown,
  IconTrendingUp,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/8bit/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";

const stats = [
  {
    label: "Players Online",
    value: "1,284",
    change: "+12.5%",
    trend: "up",
    Icon: IconUsers,
    headline: "Trending up this month",
    detail: "Highest concurrency in 6 months",
  },
  {
    label: "Total XP Earned",
    value: "45,678",
    change: "+8.2%",
    trend: "up",
    Icon: IconBolt,
    headline: "Steady grind across the hub",
    detail: "XP earned in the last 30 days",
  },
  {
    label: "Active Guilds",
    value: "312",
    change: "-20%",
    trend: "down",
    Icon: IconShieldHalf,
    headline: "Down 20% this period",
    detail: "Guild recruitment needs attention",
  },
  {
    label: "Win Rate",
    value: "64.5%",
    change: "+4.5%",
    trend: "up",
    Icon: IconTrophy,
    headline: "Above target performance",
    detail: "Ranked matches this season",
  },
] as const;

export function SectionCards() {
  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 px-4 lg:px-6 dark:*:data-[slot=card]:bg-card">
      {stats.map(({ label, value, change, trend, Icon, headline, detail }) => {
        const TrendIcon = trend === "up" ? IconTrendingUp : IconTrendingDown;

        return (
          <Card
            key={label}
            className="@container/card relative h-full transition-transform hover:-translate-y-0.5"
          >
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <Icon className="size-4 shrink-0" />
                {label}
              </CardDescription>
              <CardTitle className="font-semibold @[250px]/card:text-xl tabular-nums">
                {value}
              </CardTitle>
              <div className="absolute top-0 right-3">
                <Badge
                  variant={trend === "up" ? "default" : "destructive"}
                  className="flex items-center gap-1 text-[9px]"
                >
                  <TrendIcon className="size-3 shrink-0" />
                  {change}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex items-center gap-2 font-medium">
                <TrendIcon className="size-4 shrink-0" />
                {headline}
              </div>
              <div className="text-muted-foreground">{detail}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
