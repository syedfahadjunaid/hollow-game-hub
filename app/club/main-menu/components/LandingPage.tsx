"use client";

import GameHero1 from "@/components/ui/8bit/blocks/game-hero1";
import MainMenu from "@/components/ui/8bit/blocks/main-menu";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const LandingPage = () => {
  const containerRef = useRef(null);
  const leftPanel = useRef(null);
  const rightPanel = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1.2 },
      });

      tl.fromTo(
        leftPanel.current,
        { x: -100, opacity: 0 },
        { x: 10, opacity: 1 },
      ).fromTo(
        rightPanel.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1 },
        "-=0.8",
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 overflow-x-hidden py-4"
    >
      <div ref={leftPanel} className="w-full lg:w-1/2 opacity-0">
        <MainMenu className="w-full h-full" />
      </div>
      <div ref={rightPanel} className="w-full lg:w-1/2 opacity-0">
        <GameHero1 title="Welcome to AI Hollow Game Club" />
      </div>
    </div>
  );
};

export default LandingPage;
