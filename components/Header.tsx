import { Card } from "./ui/8bit/card";
import ThemeSelector from "./ui/8bit/theme-selector";

export default function Header() {
  return (
    <Card className="z-10 bg-background shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-xl font-semibold tracking-tight">
          Hollow Game Hub
        </h1>
        <ThemeSelector />
      </div>
    </Card>
  );
}
