import React from "react";
import ChapterIntro from "@/components/ui/8bit/blocks/chapter-intro";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-center w-full justify-between gap-20">
      <div className="w-2/3">{children}</div>
      <ChapterIntro
        title="LEVEL 1: FIERY SKELETONS"
        subtitle="Defeat the skeletons to unlock the gate."
        backgroundSrc="/images/fiery-skeletons.png"
        height="md"
        align="center"
        darken={0.5}
        className="w-1/3"
      />
    </div>
  );
}
