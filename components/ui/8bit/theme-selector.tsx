"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/8bit/select";
import { useTheme } from "next-themes";
import React from "react";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Select onValueChange={(e) => setTheme(e)}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="system">Default</SelectItem>
        <SelectItem value="sega">Sega</SelectItem>
        <SelectItem value="gameboy">Gameboy</SelectItem>
        <SelectItem value="atari">Atari</SelectItem>
      </SelectContent>
    </Select>
  );
}
