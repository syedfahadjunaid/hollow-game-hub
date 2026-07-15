import { IconDeviceGamepad2 } from "@tabler/icons-react";

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
        {/* Brand: pixel gamepad mark (always) + wordmark (sm and up) */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center bg-foreground text-background transition-transform hover:-translate-y-0.5 dark:bg-ring dark:text-background sm:size-10">
            <IconDeviceGamepad2 className="size-5 sm:size-6" />
          </span>
          <h1 className="hidden min-w-0 truncate text-lg font-semibold tracking-tight sm:block md:text-xl">
            Hollow Game Hub
          </h1>
        </div>
        <div className="flex shrink-0 items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <ThemeSelector />
          {showProfile && <HeaderProfile />}
        </div>
      </div>
    </Card>
  );
}
