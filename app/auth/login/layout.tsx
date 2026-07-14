import React from "react";
import GameProgress from "@/components/ui/8bit/blocks/game-progress";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center w-full justify-between gap-8 md:gap-12 lg:gap-20">
      <GameProgress className="w-full md:w-1/3" />
      <div className="w-full md:w-2/3">{children}</div>
    </div>
  );
}
