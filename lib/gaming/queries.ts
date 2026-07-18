"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteConversationAction,
  getConversationAction,
  listConversationsAction,
  type ActionResult,
} from "@/app/actions/gaming-actions";
import type { Conversation, ConversationDetail } from "@/lib/gaming/types";

export const gamingKeys = {
  all: ["gaming"] as const,
  conversations: ["gaming", "conversations"] as const,
  conversation: (id: string) => ["gaming", "conversation", id] as const,
};

/** Server actions return a discriminated result; React Query wants a throw. */
function unwrap<T>(result: ActionResult<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.data;
}

export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: gamingKeys.conversations,
    queryFn: async () => unwrap(await listConversationsAction()),
  });
}

export function useConversation(id: string | null) {
  return useQuery<ConversationDetail>({
    queryKey: gamingKeys.conversation(id ?? ""),
    queryFn: async () => unwrap(await getConversationAction(id as string)),
    enabled: Boolean(id),
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => unwrap(await deleteConversationAction(id)),

    // Optimistically drop the row, restore it if the request fails.
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: gamingKeys.conversations });
      const previous = queryClient.getQueryData<Conversation[]>(
        gamingKeys.conversations
      );
      queryClient.setQueryData<Conversation[]>(gamingKeys.conversations, (old) =>
        (old ?? []).filter((c) => c.id !== id)
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(gamingKeys.conversations, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: gamingKeys.conversations });
    },
  });
}
