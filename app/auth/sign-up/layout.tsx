import GameProgress from "@/components/ui/8bit/blocks/game-progress";
import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-center w-full justify-between gap-20">
      <div className="w-1/2">{children}</div>
      <GameProgress className="w-1/2" />
    </div>
  );
}
