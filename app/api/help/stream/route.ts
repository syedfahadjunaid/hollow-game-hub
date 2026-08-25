import { refreshAccessToken } from "@/lib/api-client";
import { getAccessToken } from "@/lib/auth/session";

/**
 * SSE proxy for POST /api/help/ask/stream.
 *
 * Injects the bearer token server-side and pipes the upstream stream straight back.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};

function sseError(message: string, status = 200) {
  const body =
    `data: ${JSON.stringify({ error: message })}\n\n` + `data: [DONE]\n\n`;
  return new Response(body, { status, headers: SSE_HEADERS });
}

function callUpstream(token: string | null, body: string, signal?: AbortSignal) {
  return fetch(`${BASE_URL}/api/help/ask/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
    cache: "no-store",
    signal,
  });
}

export async function POST(req: Request) {
  const body = await req.text();

  let upstream: Response;
  try {
    upstream = await callUpstream(await getAccessToken(), body, req.signal);

    if (upstream.status === 401) {
      const fresh = await refreshAccessToken();
      if (fresh) upstream = await callUpstream(fresh, body, req.signal);
    }
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return new Response(null, { status: 499 });
    }
    return sseError("Could not reach HollowGuide support service.");
  }

  if (upstream.status === 401) {
    return sseError("Your session expired. Please sign in again.");
  }

  if (!upstream.ok || !upstream.body) {
    let message = "The support service returned an error.";
    try {
      const contentType = upstream.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await upstream.json();
        if (data?.message) message = data.message;
        else if (data?.error) message = data.error;
      }
    } catch {
      // non-JSON error body
    }
    return sseError(message);
  }

  return new Response(upstream.body, { headers: SSE_HEADERS });
}
