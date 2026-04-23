"use server";

import { apiRequest } from "@/lib/api-client";
import { redirect } from "next/navigation";

interface IUserData {
  email?: string;
  displayName?: string;
  password?: string;
  role?: string;
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

    if (!response) {
      throw new Error("Oops! There might be something missing");
    }

    return {
      success: true,
      message: "Player registered successfully",
      // user: data.user,
    };
  } catch (error: any) {
    return { success: false, message: error.message, error: error.message };
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

    if (!response.token) {
      throw new Error("Oops! There might be something missing");
    }
    return {
      success: true,
      message: "Welcome back player",
      data: response.token,
    };
  } catch (error: any) {
    return { success: false, message: error.message, error: error.message };
  }
}
