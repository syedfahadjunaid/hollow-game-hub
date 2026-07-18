import { refreshAccessToken } from "@/lib/api-client";
import { getAccessToken } from "@/lib/auth/session";

/**
 * SSE proxy for POST /api/gaming/ask/stream.
 *
 * Why this exists: the access token lives in an httpOnly cookie, so browser JS
 * cannot attach it to a cross-origin request. (EventSource is also unusable —
 * it is GET-only and cannot send headers or a body.) The client posts here, we
 * inject the bearer token server-side and pipe the upstream stream straight
 * back without buffering.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  // Disable proxy buffering so tokens arrive incrementally.
  "X-Accel-Buffering": "no",
};

/** Surface failures as SSE so the client parser has a single code path. */
function sseError(message: string, status = 200) {
  const body =
    `data: ${JSON.stringify({ error: message })}\n\n` + `data: [DONE]\n\n`;
  return new Response(body, { status, headers: SSE_HEADERS });
}

function callUpstream(token: string | null, body: string) {
  return fetch(`${BASE_URL}/api/gaming/ask/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
    cache: "no-store",
  });
}

export async function POST(req: Request) {
  const body = await req.text();

  let upstream: Response;
  try {
    upstream = await callUpstream(await getAccessToken(), body);

    // Short-lived access token (15m) — refresh once and retry.
    if (upstream.status === 401) {
      const fresh = await refreshAccessToken();
      if (fresh) upstream = await callUpstream(fresh, body);
    }
  } catch {
    return sseError("Could not reach the assistant service.");
  }

  if (upstream.status === 401) {
    return sseError("Your session expired. Please sign in again.");
  }

  if (!upstream.ok || !upstream.body) {
    let message = "The assistant service returned an error.";
    try {
      const data = await upstream.json();
      if (data?.message) message = data.message;
    } catch {
      // non-JSON error body — keep the default
    }
    return sseError(message);
  }

  return new Response(upstream.body, { headers: SSE_HEADERS });
}
