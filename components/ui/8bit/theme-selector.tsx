"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/8bit/select";
import { useRetroTheme } from "@/hooks/useRetroTheme";
import { RetroModeSwitcher } from "../retro-mode-switcher";

export default function ThemeSelector() {
  const { currentConsole, currentMode, updateTheme } = useRetroTheme();

  const toggleMode = () => {
    const newMode = currentMode === "light" ? "dark" : "light";
    updateTheme(currentConsole, newMode);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* <RetroModeSwitcher toggleMode={toggleMode} /> */}
      <Select defaultValue={currentMode} onValueChange={toggleMode}>
        <SelectTrigger className="w-24 sm:w-32 md:w-44">
          <SelectValue placeholder="Light/Dark" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={currentConsole}
        onValueChange={(val) => updateTheme(val, currentMode)}
      >
        <SelectTrigger className="w-24 sm:w-32 md:w-44">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Monochrome (8-Bit)</SelectItem>
          <SelectItem value="sega">Sega (Genesis)</SelectItem>
          <SelectItem value="gameboy">GameBoy (1989)</SelectItem>
          <SelectItem value="atari">Atari (2600)</SelectItem>
          <SelectItem value="nintendo">Nintendo (NES)</SelectItem>
          <SelectItem value="cyberpunk">Cyberpunk (Neon)</SelectItem>
          <SelectItem value="matrix">Matrix (Terminal)</SelectItem>
          <SelectItem value="dracula">Dracula (Gothic)</SelectItem>
          <SelectItem value="arcade">Arcade (Amber CRT)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
