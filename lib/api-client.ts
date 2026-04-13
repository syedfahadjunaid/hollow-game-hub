const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.your-backend.com";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "API request failed");
  }

  return res.json();
}
