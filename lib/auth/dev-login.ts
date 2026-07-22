/**
 * Hard-coded test account for local UI work.
 *
 * SAFETY: this is gated on NODE_ENV, so it is inert in a production build —
 * `next build` inlines NODE_ENV="production" and the bypass becomes dead code.
 * Never remove that guard: without it these constants are a full auth bypass.
 *
 * It exists so the login flow can be exercised while the Express backend /
 * MongoDB are not running. The session it creates carries a fake token, so
 * real API calls (conversations, /ask) will still fail with 401 — by design.
 */

export const DEV_LOGIN_ENABLED = process.env.NODE_ENV !== "production";

export const DEV_LOGIN_EMAIL = "tester@hollow.dev";
export const DEV_LOGIN_PASSWORD = "hollow1234";

/** Marks the session as fake so nothing mistakes it for a real backend token. */
export const DEV_ACCESS_TOKEN = "dev-only-fake-access-token";
export const DEV_REFRESH_TOKEN = "dev-only-fake-refresh-token";

export function isDevLogin(email?: string, password?: string) {
  if (!DEV_LOGIN_ENABLED) return false;
  return email === DEV_LOGIN_EMAIL && password === DEV_LOGIN_PASSWORD;
}
