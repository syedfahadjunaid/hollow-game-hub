"use client";

import { useState } from "react";
import { IconCheck, IconCopy, IconDeviceGamepad2, IconUser } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  /** Render the blinking caret while tokens are still arriving. */
  streaming?: boolean;
}

/** Formats inline **bold**, *italic*, and `code` */
function renderInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="border border-foreground/30 bg-muted/80 px-1 py-0.5 font-mono text-[11px] text-foreground dark:border-ring/30"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/** Lightweight markdown formatting renderer for AI assistant responses */
function FormattedContent({ text, streaming }: { text: string; streaming?: boolean }) {
  if (!text) {
    if (streaming) {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
          <span>GG is typing</span>
          <span className="inline-block animate-pulse font-bold">_</span>
        </span>
      );
    }
    return null;
  }

  // Split code blocks from normal text
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-xs leading-relaxed sm:text-sm">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          // Code block
          const lines = part.slice(3, -3).trim().split("\n");
          const language = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : "";
          const code = language ? lines.slice(1).join("\n") : lines.join("\n");

          return (
            <div
              key={index}
              className="my-2 overflow-hidden border-2 border-foreground bg-black/90 text-green-400 dark:border-ring"
            >
              {language && (
                <div className="border-b border-foreground/30 bg-foreground/10 px-2 py-1 font-mono text-[10px] uppercase text-muted-foreground">
                  {language}
                </div>
              )}
              <pre className="overflow-x-auto p-2.5 font-mono text-xs text-foreground dark:text-green-400">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Standard text block — format lines (bold, inline code, bullet points)
        const lines = part.split("\n");
        return (
          <div key={index} className="space-y-1">
            {lines.map((line, lIdx) => {
              if (!line.trim()) return <div key={lIdx} className="h-1" />;

              // Headers
              if (line.startsWith("### ")) {
                return (
                  <h4 key={lIdx} className="font-bold text-foreground sm:text-base">
                    {renderInline(line.slice(4))}
                  </h4>
                );
              }
              if (line.startsWith("## ")) {
                return (
                  <h3 key={lIdx} className="text-sm font-bold text-foreground sm:text-base">
                    {renderInline(line.slice(3))}
                  </h3>
                );
              }
              if (line.startsWith("# ")) {
                return (
                  <h2 key={lIdx} className="text-base font-bold text-foreground sm:text-lg">
                    {renderInline(line.slice(2))}
                  </h2>
                );
              }

              // Bullet points
              if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="select-none text-foreground/70">•</span>
                    <span>{renderInline(line.trim().slice(2))}</span>
                  </div>
                );
              }

              return (
                <p key={lIdx} className="break-words">
                  {renderInline(line)}
                </p>
              );
            })}
          </div>
        );
      })}
      {streaming && (
        <span className="ml-1 inline-block animate-pulse font-bold text-foreground">_</span>
      )}
    </div>
  );
}

export function MessageBubble({ role, content, streaming }: MessageBubbleProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "group relative flex w-full items-start gap-2 sm:gap-3",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Pixel avatar */}
      <span
        aria-hidden="true"
        className={cn(
          "flex size-8 shrink-0 items-center justify-center border-2 border-foreground dark:border-ring sm:size-9",
          isUser
            ? "bg-muted text-foreground"
            : "bg-foreground text-background dark:bg-ring dark:text-background"
        )}
      >
        {isUser ? (
          <IconUser className="size-4 sm:size-5" />
        ) : (
          <IconDeviceGamepad2 className="size-4 sm:size-5" />
        )}
      </span>

      <div
        className={cn(
          "relative max-w-[88%] border-y-4 border-foreground px-3 py-2.5 dark:border-ring sm:max-w-[80%]",
          isUser ? "bg-muted" : "bg-card"
        )}
      >
        {/* Side borders matching 8-bit theme */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -mx-1 border-x-4 border-foreground dark:border-ring"
        />

        {/* Role header bar */}
        <div className="relative z-10 mb-1.5 flex items-center justify-between gap-2 border-b border-foreground/20 pb-1 dark:border-ring/20">
          <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
            {isUser ? "YOU" : "GG AI"}
          </span>

          {!isUser && content && (
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 font-mono text-[9px] text-muted-foreground transition-colors hover:text-foreground"
              title="Copy response"
            >
              {copied ? (
                <>
                  <IconCheck className="size-3 text-green-500" />
                  <span className="text-green-500">COPIED</span>
                </>
              ) : (
                <>
                  <IconCopy className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="opacity-0 transition-opacity group-hover:opacity-100">COPY</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Content body */}
        <div className="relative z-10">
          {isUser ? (
            <p className="whitespace-pre-wrap break-words text-xs leading-relaxed sm:text-sm">
              {content}
            </p>
          ) : (
            <FormattedContent text={content} streaming={streaming} />
          )}
        </div>
      </div>
    </div>
  );
}
