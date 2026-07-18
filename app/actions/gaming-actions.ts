"use server";

import { ApiError, apiRequest } from "@/lib/api-client";
import {
  askResponseSchema,
  conversationDetailSchema,
  conversationSchema,
  safeParseOr,
  type AskResponse,
  type Conversation,
  type ConversationDetail,
} from "@/lib/gaming/types";
import { z } from "zod";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

async function run<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message, status: error.status };
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}

/** GET /api/gaming/conversations */
export async function listConversationsAction(): Promise<
  ActionResult<Conversation[]>
> {
  return run(async () => {
    const raw = await apiRequest("/api/gaming/conversations");
    return safeParseOr(z.array(conversationSchema), raw ?? [], "conversation list");
  });
}

/** GET /api/gaming/conversations/:id */
export async function getConversationAction(
  id: string
): Promise<ActionResult<ConversationDetail>> {
  return run(async () => {
    const raw = await apiRequest(
      `/api/gaming/conversations/${encodeURIComponent(id)}`
    );
    return safeParseOr(conversationDetailSchema, raw, "conversation detail");
  });
}

/** DELETE /api/gaming/conversations/:id — 204 No Content */
export async function deleteConversationAction(
  id: string
): Promise<ActionResult<null>> {
  return run(async () => {
    await apiRequest(`/api/gaming/conversations/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return null;
  });
}

/**
 * POST /api/gaming/ask — non-streaming fallback.
 * There is no POST /conversations on the backend: omitting `conversationId`
 * creates the thread implicitly and returns its id.
 */
export async function askAction(input: {
  message: string;
  conversationId?: string;
}): Promise<ActionResult<AskResponse>> {
  return run(async () => {
    const raw = await apiRequest("/api/gaming/ask", {
      method: "POST",
      body: JSON.stringify({
        message: input.message,
        ...(input.conversationId ? { conversationId: input.conversationId } : {}),
      }),
    });
    return safeParseOr(askResponseSchema, raw, "ask response");
  });
}
