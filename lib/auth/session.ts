import { cookies } from "next/headers";

/**
 * Server-only session helpers.
 *
 * The backend issues a short-lived access token (ACCESS_TOKEN_TTL, 15m by default)
 * plus a refresh token (7d). Both are kept in httpOnly cookies so client JS can
 * never read them — the trade-off is that any request needing the token must go
 * through a server action or a route handler.
 *
 * NOTE: `cookies().set()` is only allowed in Server Actions and Route Handlers.
 * During an RSC render it throws, so every write here is best-effort.
 */

const ACCESS_COOKIE = "hgh_access";
const REFRESH_COOKIE = "hgh_refresh";

const ACCESS_MAX_AGE = 60 * 15; // 15m, matches ACCESS_TOKEN_TTL
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7d, matches REFRESH_TOKEN_TTL_DAYS

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function setSession(accessToken: string, refreshToken?: string) {
  try {
    const store = await cookies();
    store.set(ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_MAX_AGE));
    if (refreshToken) {
      store.set(REFRESH_COOKIE, refreshToken, cookieOptions(REFRESH_MAX_AGE));
    }
  } catch {
    // Called from an RSC render — the caller still holds the fresh token for
    // the current request, it just won't be persisted.
  }
}

export async function clearSession() {
  try {
    const store = await cookies();
    store.delete(ACCESS_COOKIE);
    store.delete(REFRESH_COOKIE);
  } catch {
    // See setSession.
  }
}

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH_COOKIE)?.value ?? null;
}
