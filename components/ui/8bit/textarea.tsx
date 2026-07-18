import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";

import "@/components/ui/8bit/styles/retro.css";

export const textareaVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

export interface BitTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  asChild?: boolean;
  ref?: React.Ref<HTMLTextAreaElement>;
}

function Textarea({ className, font, ...props }: BitTextareaProps) {
  return (
    <div
      className={cn(
        "relative flex items-center border-foreground border-y-6 !p-0 dark:border-ring",
        className
      )}
    >
      <ShadcnTextarea
        {...props}
        className={cn(
          "!w-full rounded-none ring-0",
          font !== "normal" && "retro",
          className
        )}
      />

      <div
        className="pointer-events-none absolute inset-0 -mx-1.5 border-foreground border-x-6 dark:border-ring"
        aria-hidden="true"
      />
    </div>
  );
}

export { Textarea };
