import { getAccessToken, getRefreshToken, setSession } from "@/lib/auth/session";

const BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export class ApiError extends Error {
  status: number;
  rateLimitReset: number | null;

  constructor(status: number, message: string, rateLimitReset: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.rateLimitReset = rateLimitReset;
  }
}

async function readError(res: Response) {
  let rateLimitReset: number | null = null;
  const resetHeader = res.headers.get("RateLimit-Reset") || res.headers.get("X-RateLimit-Reset");
  if (resetHeader) {
    const parsed = parseInt(resetHeader, 10);
    if (!isNaN(parsed)) rateLimitReset = parsed;
  }

  try {
    const body = await res.json();
    const message = body?.error?.message || body?.message || "API request failed";
    return new ApiError(res.status, message, rateLimitReset);
  } catch {
    return new ApiError(res.status, res.statusText || "API request failed", rateLimitReset);
  }
}

/**
 * Exchange the refresh token for a new access token.
 * Returns the new access token, or null if the session is unrecoverable.
 *
 * The backend reads the refresh token from its own cookie OR from the request
 * body. We call it server-to-server, so that cookie isn't in play — we send the
 * value we stored ourselves in the body.
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data?.accessToken) return null;

  await setSession(data.accessToken, data.refreshToken);
  return data.accessToken as string;
}

/**
 * Authenticated fetch against the backend. Server-only (reads httpOnly cookies).
 * On 401 it transparently refreshes once and retries.
 */
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  { retryOn401 = true }: { retryOn401?: boolean } = {}
) {
  const token = await getAccessToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  if (res.status === 401 && retryOn401) {
    const fresh = await refreshAccessToken();
    if (fresh) {
      return apiRequest(endpoint, options, { retryOn401: false });
    }
  }

  if (!res.ok) throw await readError(res);

  // 204 No Content (e.g. DELETE conversation, logout)
  if (res.status === 204 || res.headers.get("content-length") === "0") return null;

  return res.json();
}

export { BASE_URL };
