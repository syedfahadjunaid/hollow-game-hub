"use server";

import { apiRequest, ApiError } from "@/lib/api-client";

export interface IHelpFaqItem {
  q: string;
  a: string;
}

export interface IHelpFaqs {
  economy?: IHelpFaqItem[];
  pvp?: IHelpFaqItem[];
  guilds?: IHelpFaqItem[];
  quests?: IHelpFaqItem[];
  general?: IHelpFaqItem[];
  [key: string]: IHelpFaqItem[] | undefined;
}

export interface IHelpAskResponse {
  conversationId: string;
  answer: string;
  model?: string;
  toolResults?: Array<{
    name: string;
    data: any;
  }>;
}

export interface IHelpConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}

/**
 * Send a question to HollowGuide Support Assistant (non-streaming)
 */
export async function askHelpAction(
  message: string,
  conversationId?: string
): Promise<{
  success: boolean;
  data?: IHelpAskResponse;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/help/ask", {
      method: "POST",
      body: JSON.stringify({ message, conversationId }),
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * Fetch curated platform FAQs
 */
export async function getHelpFaqsAction(): Promise<{
  success: boolean;
  faqs?: IHelpFaqs;
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/help/faq", { method: "GET" });
    return { success: true, faqs: data?.faqs || {} };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

/**
 * List user's help conversations
 */
export async function getHelpConversationsAction(): Promise<{
  success: boolean;
  conversations?: IHelpConversation[];
  error?: string;
}> {
  try {
    const data = await apiRequest("/api/help/conversations", { method: "GET" });
    return { success: true, conversations: Array.isArray(data) ? data : [] };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}
