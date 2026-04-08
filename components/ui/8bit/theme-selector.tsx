"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/8bit/select";
import { useRetroTheme } from "@/hooks/useRetroTheme";
import { Sun, Moon } from "lucide-react";
import { Switch } from "./switch";
import { RetroModeSwitcher } from "../retro-mode-switcher";

export default function ThemeSelector() {
  const { currentConsole, currentMode, updateTheme } = useRetroTheme();

  const toggleMode = () => {
    const newMode = currentMode === "light" ? "dark" : "light";
    updateTheme(currentConsole, newMode);
  };

  return (
    <div className="flex items-center gap-4">
      <RetroModeSwitcher toggleMode={toggleMode} />
      <Select
        defaultValue={currentConsole}
        onValueChange={(val) => updateTheme(val, currentMode)}
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="sega">Sega</SelectItem>
          <SelectItem value="gameboy">Gameboy</SelectItem>
          <SelectItem value="atari">Atari</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
