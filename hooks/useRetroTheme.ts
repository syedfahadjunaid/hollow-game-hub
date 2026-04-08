import { useTheme } from "next-themes";

export function useRetroTheme() {
  const { theme, setTheme } = useTheme();

  // Fallback to avoid split error on undefined server-side
  const currentTheme = theme || "default-dark";
  const [consolePart, modePart] = currentTheme.split("-");

  return {
    currentConsole: consolePart || "default",
    currentMode: modePart || "dark",
    updateTheme: (c: string, m: string) => setTheme(`${c}-${m}`),
  };
}
