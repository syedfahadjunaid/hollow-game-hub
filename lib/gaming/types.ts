import { z } from "zod";

/**
 * Schemas mirror the backend's actual responses (src/routes/gaming.routes.js).
 * Mongoose `toJSON` exposes `id` (virtual) and deletes `_id`.
 *
 * They are intentionally lenient: unknown/extra fields pass through and only
 * the fields the UI actually depends on are required, so a backend addition
 * never blanks the screen.
 */

export const conversationSchema = z
  .object({
    id: z.string(),
    title: z.string().default("New conversation"),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .loose();

export type Conversation = z.infer<typeof conversationSchema>;

export const messageSchema = z
  .object({
    id: z.string(),
    conversationId: z.string().optional(),
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
    createdAt: z.string().optional(),
  })
  .loose();

export type Message = z.infer<typeof messageSchema>;

export const conversationDetailSchema = z.object({
  conversation: conversationSchema,
  messages: z.array(messageSchema),
});

export type ConversationDetail = z.infer<typeof conversationDetailSchema>;

/** POST /api/gaming/ask */
export const askResponseSchema = z
  .object({
    conversationId: z.string(),
    answer: z.string(),
    model: z.string().optional(),
    onTopic: z.boolean().optional(),
    usage: z.unknown().optional(),
  })
  .loose();

export type AskResponse = z.infer<typeof askResponseSchema>;

/**
 * SSE chunk shapes emitted by POST /api/gaming/ask/stream:
 *   data: {"token":"..."}                      — one token
 *   data: {"done":true,"conversationId":"..."} — final
 *   data: {"error":"..."}                      — mid-stream failure
 *   data: [DONE]                               — terminator
 */
export type StreamChunk =
  | { token: string }
  | { done: true; conversationId: string }
  | { error: string };

/** Parse leniently: fall back to the raw payload rather than failing the UI. */
export function safeParseOr<T>(schema: z.ZodType<T>, raw: unknown, label: string): T {
  const result = schema.safeParse(raw);
  if (result.success) return result.data;
  console.warn(`[gaming] unexpected ${label} shape:`, result.error.issues);
  return raw as T;
}
