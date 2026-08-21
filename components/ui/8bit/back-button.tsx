"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";

interface IBackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = "BACK", className }: IBackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Link href={href}>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-7 sm:h-8 px-2 sm:px-3 text-xs font-mono font-bold flex items-center gap-1.5 border-2 border-foreground dark:border-ring shadow-xs group hover:scale-[1.02] transition-transform",
            className
          )}
        >
          <IconArrowLeft className="size-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>{label}</span>
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.back()}
      className={cn(
        "h-7 sm:h-8 px-2 sm:px-3 text-xs font-mono font-bold flex items-center gap-1.5 border-2 border-foreground dark:border-ring shadow-xs group hover:scale-[1.02] transition-transform",
        className
      )}
    >
      <IconArrowLeft className="size-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
      <span>{label}</span>
    </Button>
  );
}
