"use server";

import { apiRequest, ApiError } from "@/lib/api-client";

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  threadCount: number;
}

export interface ForumAuthor {
  id: string;
  name?: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

export interface ForumThread {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: ForumAuthor;
  category: ForumCategory;
  tags: string[];
  views: number;
  upvotes: string[];
  upvoteCount: number;
  commentCount: number;
  isPinned: boolean;
  isLocked: boolean;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumComment {
  id: string;
  thread: string;
  author: ForumAuthor;
  parentComment?: string | null;
  content: string;
  upvotes: string[];
  upvoteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetThreadsResponse {
  threads: ForumThread[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TopicSuggestion {
  title: string;
  categorySlug: string;
  tags: string[];
  content: string;
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
}

export async function getCategoriesAction(): Promise<{ success: boolean; categories?: ForumCategory[]; error?: string }> {
  try {
    const res = await apiRequest("/api/forum/categories", { method: "GET" });
    return { success: true, categories: res.categories };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

export async function getThreadsAction(params?: {
  category?: string;
  search?: string;
  sort?: "latest" | "popular" | "views";
  page?: number;
  limit?: number;
}): Promise<{ success: boolean; data?: GetThreadsResponse; error?: string }> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.sort) searchParams.set("sort", params.sort);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const queryString = searchParams.toString();
    const data = await apiRequest(`/api/forum/threads${queryString ? `?${queryString}` : ""}`, { method: "GET" });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

export async function getThreadByIdAction(id: string): Promise<{ success: boolean; thread?: ForumThread; error?: string }> {
  try {
    const res = await apiRequest(`/api/forum/threads/${id}`, { method: "GET" });
    return { success: true, thread: res.thread };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

export async function createThreadAction(data: {
  title: string;
  content: string;
  categoryId: string;
  tags?: string[];
}): Promise<{ success: boolean; thread?: ForumThread; error?: string }> {
  try {
    const res = await apiRequest("/api/forum/threads", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { success: true, thread: res.thread };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

export async function toggleVoteThreadAction(id: string): Promise<{ success: boolean; upvotes?: number; hasVoted?: boolean; error?: string }> {
  try {
    const res = await apiRequest(`/api/forum/threads/${id}/vote`, {
      method: "POST",
    });
    return { success: true, upvotes: res.upvotes, hasVoted: res.hasVoted };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

export async function getCommentsAction(threadId: string): Promise<{ success: boolean; comments?: ForumComment[]; error?: string }> {
  try {
    const res = await apiRequest(`/api/forum/threads/${threadId}/comments`, { method: "GET" });
    return { success: true, comments: res.comments };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

export async function createCommentAction(
  threadId: string,
  data: { content: string; parentCommentId?: string }
): Promise<{ success: boolean; comment?: ForumComment; error?: string }> {
  try {
    const res = await apiRequest(`/api/forum/threads/${threadId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { success: true, comment: res.comment };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

export async function toggleVoteCommentAction(commentId: string): Promise<{ success: boolean; upvotes?: number; hasVoted?: boolean; error?: string }> {
  try {
    const res = await apiRequest(`/api/forum/comments/${commentId}/vote`, {
      method: "POST",
    });
    return { success: true, upvotes: res.upvotes, hasVoted: res.hasVoted };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

export async function suggestTopicAction(prompt?: string): Promise<{ success: boolean; suggestion?: TopicSuggestion; error?: string }> {
  try {
    const res = await apiRequest("/api/forum/suggest-topic", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
    return { success: true, suggestion: res.suggestion };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}
