"use server";

import { apiRequest, ApiError } from "@/lib/api-client";
import { clearSession, setSession } from "@/lib/auth/session";
import {
  DEV_ACCESS_TOKEN,
  DEV_REFRESH_TOKEN,
  isDevLogin,
} from "@/lib/auth/dev-login";

interface IUserData {
  email?: string;
  displayName?: string;
  password?: string;
  role?: string;
}

/**
 * The backend returns `{ user, accessToken, refreshToken }` for both register
 * and login — note it is `accessToken`, not `token`.
 */
interface IAuthResponse {
  user?: { id: string; email: string; role?: string };
  accessToken?: string;
  refreshToken?: string;
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

export async function registerUserAction(userData: IUserData) {
  try {
    const response: IAuthResponse = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        role: userData.role,
      }),
    });

    if (!response?.accessToken) {
      throw new Error("Oops! There might be something missing");
    }

    await setSession(response.accessToken, response.refreshToken);

    return {
      success: true,
      message: "Player registered successfully",
    };
  } catch (error: unknown) {
    const message = errorMessage(error);
    return { success: false, message, error: message };
  }
}

export async function loginUserAction(userData: IUserData) {
  // Dev-only test account — no-ops in production (see lib/auth/dev-login.ts).
  if (isDevLogin(userData.email, userData.password)) {
    await setSession(DEV_ACCESS_TOKEN, DEV_REFRESH_TOKEN);
    return {
      success: true,
      message: "Welcome back player (dev login)",
    };
  }

  try {
    const response: IAuthResponse = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    if (!response?.accessToken) {
      throw new Error("Oops! There might be something missing");
    }

    await setSession(response.accessToken, response.refreshToken);

    return {
      success: true,
      message: "Welcome back player",
    };
  } catch (error: unknown) {
    const message = errorMessage(error);
    return { success: false, message, error: message };
  }
}

export async function getCurrentUserAction() {
  try {
    const response = await apiRequest("/api/auth/me", { method: "GET" });
    return {
      success: true,
      user: response?.user || response || null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      user: null,
      error: errorMessage(error),
    };
  }
}

export async function logoutAction() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } catch {
    // Even if the backend call fails, drop the local session.
  }
  await clearSession();
  return { success: true, message: "Signed out" };
}
