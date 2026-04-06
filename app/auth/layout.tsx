import { RetroModeSwitcher } from "@/components/ui/retro-mode-switcher";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <Card className="z-10 bg-background shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-semibold tracking-tight">
            Hollow Game Hub
          </h1>
          <div className="flex items-center gap-4">
            <RetroModeSwitcher />
            <Button>Sign Up</Button>
          </div>
        </div>
      </Card>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <div className="container mx-auto p-6">{children}</div>
      </main>

      {/* Footer */}
      <Card className="border-t bg-background">
        <div className="flex items-center justify-between px-6">
          <p className="text-xs text-muted-foreground">
            Hollow Game Hub 2026, All Rights Reserved
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
