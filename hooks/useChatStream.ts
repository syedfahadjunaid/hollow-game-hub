"use client";

import { useCallback, useRef, useState } from "react";

export type StreamStatus = "idle" | "streaming" | "done" | "error" | "aborted";

interface SendArgs {
  message: string;
  conversationId?: string;
}

interface UseChatStreamOptions {
  /** Fired once the stream completes cleanly, with the (possibly new) thread id. */
  onComplete?: (conversationId: string | undefined, answer: string) => void;
  onError?: (message: string) => void;
}

/**
 * Drives POST /api/gaming/ask/stream (our proxy route).
 *
 * Wire format produced by the backend controller:
 *   data: {"token":"..."}
 *   data: {"done":true,"conversationId":"..."}
 *   data: {"error":"..."}
 *   data: [DONE]
 */
export function useChatStream({ onComplete, onError }: UseChatStreamOptions = {}) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<StreamStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("aborted");
  }, []);

  const reset = useCallback(() => {
    setText("");
    setStatus("idle");
  }, []);

  const send = useCallback(
    async ({ message, conversationId }: SendArgs) => {
      // Abort any in-flight stream (also guards StrictMode double-invoke).
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setText("");
      setStatus("streaming");

      let answer = "";
      let newConversationId: string | undefined = conversationId;

      try {
        const res = await fetch("/api/gaming/ask/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, conversationId }),
          signal: controller.signal,
        });

        if (!res.body) throw new Error("No response stream");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE frames are separated by a blank line.
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            const line = frame.trim();
            if (!line.startsWith("data:")) continue;

            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;

            let chunk: Record<string, unknown>;
            try {
              chunk = JSON.parse(payload);
            } catch {
              continue; // ignore malformed frame rather than killing the stream
            }

            if (typeof chunk.error === "string") {
              throw new Error(chunk.error);
            }

            if (typeof chunk.token === "string") {
              answer += chunk.token;
              setText(answer);
            }

            if (chunk.done === true) {
              if (typeof chunk.conversationId === "string") {
                newConversationId = chunk.conversationId;
              }
            }
          }
        }

        setStatus("done");
        abortRef.current = null;
        onComplete?.(newConversationId, answer);
      } catch (error: unknown) {
        abortRef.current = null;

        // An intentional stop() is not an error.
        if (error instanceof DOMException && error.name === "AbortError") {
          setStatus("aborted");
          if (answer) onComplete?.(newConversationId, answer);
          return;
        }

        const message =
          error instanceof Error ? error.message : "The assistant failed to respond.";
        setStatus("error");
        onError?.(message);
      }
    },
    [onComplete, onError]
  );

  return { text, status, send, stop, reset, isStreaming: status === "streaming" };
}
