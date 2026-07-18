"use client";

import { IconPlus, IconTrash } from "@tabler/icons-react";

import { Button } from "@/components/ui/8bit/button";
import { Skeleton } from "@/components/ui/8bit/skeleton";
import { useConversations, useDeleteConversation } from "@/lib/gaming/queries";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function ConversationList({ activeId, onSelect }: ConversationListProps) {
  const { data, isLoading, isError, error } = useConversations();
  const remove = useDeleteConversation();

  return (
    <div className="flex h-full flex-col gap-3">
      <Button onClick={() => onSelect(null)} className="w-full shrink-0">
        <IconPlus className="size-4" />
        New chat
      </Button>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        )}

        {isError && (
          <p className="p-2 text-[10px] text-destructive sm:text-xs">
            {error instanceof Error ? error.message : "Could not load chats."}
          </p>
        )}

        {!isLoading && !isError && (data?.length ?? 0) === 0 && (
          <p className="p-2 text-[10px] text-muted-foreground sm:text-xs">
            No chats yet. Start one below.
          </p>
        )}

        <ul className="flex flex-col gap-1">
          {data?.map((c) => (
            <li key={c.id} className="group flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className={cn(
                  "min-w-0 flex-1 truncate border-2 px-2 py-1.5 text-left text-[10px] transition-colors sm:text-xs",
                  activeId === c.id
                    ? "border-foreground bg-muted dark:border-ring"
                    : "border-transparent hover:border-foreground/40 hover:bg-muted/50"
                )}
                title={c.title}
              >
                {c.title || "New conversation"}
              </button>

              <button
                type="button"
                aria-label={`Delete ${c.title || "conversation"}`}
                onClick={() => {
                  if (activeId === c.id) onSelect(null);
                  remove.mutate(c.id);
                }}
                className="shrink-0 p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
              >
                <IconTrash className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
