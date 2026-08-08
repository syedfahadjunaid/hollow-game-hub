"use client";

import { useEffect, useRef, useState } from "react";
import { IconPlayerStopFilled, IconSend } from "@tabler/icons-react";

import { Button } from "@/components/ui/8bit/button";

interface ComposerProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  /** Lets the empty-state suggestion chips prefill the box. */
  prefill?: string | null;
}

export function Composer({
  onSend,
  onStop,
  isStreaming,
  disabled,
  prefill,
}: ComposerProps) {
  const [value, setValue] = useState("");
  const [lastPrefill, setLastPrefill] = useState(prefill);
  const ref = useRef<HTMLTextAreaElement>(null);

  // Sync state if prefill prop updates
  if (prefill !== lastPrefill) {
    setLastPrefill(prefill);
    if (prefill) setValue(prefill);
  }

  // Focus effect
  useEffect(() => {
    if (prefill) ref.current?.focus();
  }, [prefill]);

  // Auto-resize textarea height dynamically
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [value]);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue("");
    if (ref.current) {
      ref.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter inserts a newline.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-1.5 border-t-4 border-foreground bg-background p-3 dark:border-ring sm:p-4"
    >
      <label htmlFor="chat-composer" className="sr-only">
        Ask the gaming assistant
      </label>

      <div className="flex items-end gap-2 sm:gap-3">
        <textarea
          id="chat-composer"
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          placeholder="Ask about mechanics, builds, lore..."
          className="max-h-40 flex-1 resize-none border-2 border-foreground bg-card p-2 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring dark:border-ring sm:text-sm"
        />

        {isStreaming ? (
          <Button
            type="button"
            onClick={onStop}
            variant="outline"
            aria-label="Stop generating"
            className="shrink-0"
          >
            <IconPlayerStopFilled className="size-4" />
            <span className="hidden sm:inline">Stop</span>
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!value.trim() || disabled}
            aria-label="Send message"
            className="shrink-0"
          >
            <IconSend className="size-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground px-0.5">
        <span className="flex items-center gap-1">
          <span>Press</span>
          <kbd className="rounded border border-foreground/40 bg-muted/60 px-1 py-0.2 dark:border-ring/40">Enter ↵</kbd>
          <span>to send</span>
        </span>

        {value.length > 0 && (
          <span>{value.length} chars</span>
        )}
      </div>
    </form>
  );
}
