"use client";

import { useState } from "react";
import { IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { Button } from "@/components/ui/8bit/button";
import { isSoundMuted, toggleSoundMute, playClickSound } from "@/lib/sound";

export function SoundToggle() {
  const [muted, setMuted] = useState(() => isSoundMuted());

  const handleToggle = () => {
    const next = toggleSoundMute();
    setMuted(next);
    if (!next) {
      playClickSound();
    }
  };

  return (
    <Button
      onClick={handleToggle}
      className="retro flex items-center gap-1.5 px-3"
      size="sm"
      variant="ghost"
      title={muted ? "Unmute Retro SFX" : "Mute Retro SFX"}
    >
      {muted ? (
        <IconVolumeOff className="size-5 text-muted-foreground" />
      ) : (
        <IconVolume className="size-5 text-amber-400 animate-pulse" />
      )}
      <span className="text-xs font-bold hidden sm:inline">
        {muted ? "SFX OFF" : "SFX ON"}
      </span>
    </Button>
  );
}
