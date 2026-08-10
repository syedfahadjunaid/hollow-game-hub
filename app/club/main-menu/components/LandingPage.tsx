"use client";

import MainMenu from "@/components/ui/8bit/blocks/main-menu";
import LandingPageContent from "@/components/landing/LandingPageContent";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const LandingPage = () => {
  const containerRef = useRef(null);
  const menuPanel = useRef(null);
  const contentPanel = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      tl.fromTo(
        menuPanel.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1 }
      ).fromTo(
        contentPanel.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.6"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-full space-y-6 py-4">
      {/* Top Section: Quick Main Menu Navigation */}
      <div ref={menuPanel} className="w-full max-w-2xl mx-auto opacity-0">
        <MainMenu className="w-full shadow-lg" />
      </div>

      {/* Main Showcase Section */}
      <div ref={contentPanel} className="w-full opacity-0">
        <LandingPageContent mode="club" />
      </div>
    </div>
  );
};

export default LandingPage;

