import HeaderProfile from "./HeaderProfile";
import { Card } from "./ui/8bit/card";
import ThemeSelector from "./ui/8bit/theme-selector";

interface IHeaderProps {
  showProfile?: boolean;
}

export default function Header({ showProfile }: IHeaderProps) {
  return (
    <Card className="z-10 bg-background shadow-sm">
      <div className="flex h-16 items-center justify-between gap-2 px-4 sm:px-6">
        <h1 className="min-w-0 truncate text-base font-semibold tracking-tight sm:text-lg md:text-xl">
          Hollow Game Hub
        </h1>
        <div className="flex shrink-0 items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <ThemeSelector />
          {showProfile && <HeaderProfile />}
        </div>
      </div>
    </Card>
  );
}
