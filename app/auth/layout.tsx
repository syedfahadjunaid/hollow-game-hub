import React from "react";
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
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
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
