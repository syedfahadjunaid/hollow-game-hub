import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";

const menuItems = [
  {
    label: "START GAME",
    url: "/club/games",
  },
  {
    label: "AI CHAT ASSISTANT",
    url: "/club/chat",
  },
  {
    label: "HIGH SCORES & DASHBOARD",
    url: "/club/dashboard",
  },
];

export default function MainMenu({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader className="flex flex-col items-center justify-center gap-2">
        <CardTitle>Main Menu</CardTitle>
        <CardDescription>Retro 8-bit Quest</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.url} className="w-full">
              <Button className="w-full flex items-center justify-center gap-2">
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
