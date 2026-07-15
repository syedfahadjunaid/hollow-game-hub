import React from "react";
import { IconDeviceGamepad2 } from "@tabler/icons-react";
import { Card } from "@/components/ui/8bit/card";

import Header from "@/components/Header";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <div className="container mx-auto p-4 sm:p-6 flex items-center justify-center min-h-full">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Card className="border-t bg-background">
        <div className="flex flex-col items-center justify-between gap-2 px-4 py-3 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="flex items-center gap-2 text-[10px] text-muted-foreground sm:text-xs">
            <IconDeviceGamepad2 className="size-3.5 shrink-0" />
            <span>&copy; 2026 Hollow Game Hub — All Rights Reserved</span>
          </p>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground sm:gap-4 sm:text-xs">
            <a
              href="#"
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Privacy
            </a>
            <span aria-hidden="true" className="text-muted-foreground/40">
              &bull;
            </span>
            <a
              href="#"
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Terms
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
