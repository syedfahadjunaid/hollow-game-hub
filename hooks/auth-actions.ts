"use server";

interface IUserData {
  email: string;
  password: string;
  role: string;
}
export async function registerUserAction(userData: IUserData) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.BACKEND_API_KEY as string, // Secret key remains safe
        },
        body: JSON.stringify(userData),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
