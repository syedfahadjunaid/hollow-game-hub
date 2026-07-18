"use client";

import { useEffect, useRef, useState } from "react";
import { IconPlayerStopFilled, IconSend } from "@tabler/icons-react";

import { Button } from "@/components/ui/8bit/button";
import { Textarea } from "@/components/ui/8bit/textarea";

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

  // Adjusting state during render when a prop changes — React's recommended
  // alternative to a sync effect (no cascading render).
  if (prefill !== lastPrefill) {
    setLastPrefill(prefill);
    if (prefill) setValue(prefill);
  }

  // Focus is a DOM side effect, so it stays in an effect (no setState here).
  useEffect(() => {
    if (prefill) ref.current?.focus();
  }, [prefill]);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue("");
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
      className="flex items-end gap-2 border-t-4 border-foreground bg-background p-3 dark:border-ring sm:gap-3 sm:p-4"
    >
      <label htmlFor="chat-composer" className="sr-only">
        Ask the gaming assistant
      </label>

      <Textarea
        id="chat-composer"
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
        placeholder="Ask about mechanics, builds, lore..."
        className="max-h-40 flex-1 text-xs sm:text-sm"
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
    </form>
  );
}
