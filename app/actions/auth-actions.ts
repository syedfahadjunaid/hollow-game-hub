"use server";

import { apiRequest } from "@/lib/api-client";
import { redirect } from "next/navigation";

interface IUserData {
  email: string;
  displayName: string;
  password: string;
  role: string;
}
export async function registerUserAction(userData: IUserData) {
  try {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        role: userData.role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function loginUserAction(userData: IUserData) {
  try {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    // return { success: true, user: data.user };

    redirect(`/main-menu/${data.token}`);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
