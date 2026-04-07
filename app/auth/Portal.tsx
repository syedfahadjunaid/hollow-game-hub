"use client";

import PortalTransition from "@/components/ui/8bit/blocks/portal-transition";
import { useRouter } from "next/navigation";

export default function Portal() {
  const router = useRouter();
  return (
    <PortalTransition
      title="Click to go through the portal"
      description="The gateway is open. One step and you're in the next realm."
      badge="FAST TRAVEL"
      primaryLabel="Enter Portal"
      secondaryLabel="Choose Destination"
      travelingText="Traveling..."
      href="/auth/login"
      hrefSecondary="/auth/sign-up"
      imageSrc="/images/portalImage1.png"
      onEnter={() => {
        router.push("/auth/login");
      }}
      className="bg-transparent"
    />
  );
}
