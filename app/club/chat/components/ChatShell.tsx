"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IconMessages, IconPlus, IconRobot, IconUsers } from "@tabler/icons-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/8bit/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/8bit/drawer";
import { gamingKeys, useConversation } from "@/lib/gaming/queries";
import { useChatStream } from "@/hooks/useChatStream";
import { SocketProvider, useSocket } from "@/lib/socket/SocketContext";
import { useCommunityChat } from "@/hooks/useCommunityChat";

import { ChatThread } from "./ChatThread";
import { Composer } from "./Composer";
import { ConversationList } from "./ConversationList";
import { RoomList } from "./RoomList";
import { CommunityChatThread } from "./CommunityChatThread";

type ChatMode = "ai" | "community";

export function ChatShell() {
  const [mode, setMode] = useState<ChatMode>("ai");

  return (
    <SocketProvider>
      <div className="flex flex-col h-full min-h-0 w-full gap-3">
        {/* Mode Selector Tabs */}
        <div className="flex shrink-0 gap-2 border-b-2 border-muted pb-2 font-mono text-xs overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setMode("ai")}
            className={`flex items-center gap-1.5 px-3 py-1.5 border-2 transition-all whitespace-nowrap ${
              mode === "ai"
                ? "border-foreground bg-primary text-primary-foreground font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "border-transparent bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <IconRobot className="size-4 shrink-0" />
            <span className="text-[11px] sm:text-xs">GG AI ASSISTANT</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("community")}
            className={`flex items-center gap-1.5 px-3 py-1.5 border-2 transition-all whitespace-nowrap ${
              mode === "community"
                ? "border-foreground bg-primary text-primary-foreground font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "border-transparent bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <IconUsers className="size-4 shrink-0" />
            <span className="text-[11px] sm:text-xs">COMMUNITY CHANNELS</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-0 flex-1">
          {mode === "ai" ? <AiAssistantShell /> : <CommunityChatShell />}
        </div>
      </div>
    </SocketProvider>
  );
}

function AiAssistantShell() {
  const queryClient = useQueryClient();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading } = useConversation(activeId);

  const handleComplete = useCallback(
    (conversationId: string | undefined) => {
      setPendingUser(null);

      if (conversationId && conversationId !== activeId) {
        setActiveId(conversationId);
      }

      if (conversationId) {
        queryClient.invalidateQueries({
          queryKey: gamingKeys.conversation(conversationId),
        });
      }
      queryClient.invalidateQueries({ queryKey: gamingKeys.conversations });
    },
    [activeId, queryClient]
  );

  const handleError = useCallback((message: string) => {
    setPendingUser(null);
    toast.error(message);
  }, []);

  const { text, status, send, stop, reset, isStreaming } = useChatStream({
    onComplete: handleComplete,
    onError: handleError,
  });

  function handleSend(message: string) {
    setPendingUser(message);
    setPrefill(null);
    send({ message, conversationId: activeId ?? undefined });
  }

  function handleSelect(id: string | null) {
    stop();
    reset();
    setPendingUser(null);
    setActiveId(id);
    setDrawerOpen(false);
  }

  const sidebar = (
    <ConversationList activeId={activeId} onSelect={handleSelect} />
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col md:flex-row md:gap-4">
      <aside className="hidden shrink-0 md:block md:w-64 lg:w-72">{sidebar}</aside>

      <div className="mb-3 md:hidden">
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2 truncate">
                <IconMessages className="size-4 shrink-0" />
                <span className="truncate">{data?.conversation?.title || "Conversations"}</span>
              </span>
              <span className="shrink-0 font-mono text-[10px] uppercase text-muted-foreground">Select</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[75vh] p-4">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-sm">Conversations</DrawerTitle>
            </DrawerHeader>
            <div className="min-h-0 flex-1 overflow-y-auto">{sidebar}</div>
          </DrawerContent>
        </Drawer>
      </div>

      <section className="flex min-h-0 flex-1 flex-col border-4 border-foreground bg-card dark:border-ring">
        <div className="flex items-center justify-between border-b-4 border-foreground bg-muted/60 px-3 py-2 dark:border-ring">
          <div className="flex min-w-0 items-center gap-2">
            <span className="relative flex size-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-green-500"></span>
            </span>
            <span className="truncate font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              {data?.conversation?.title || "GG ASSISTANT ONLINE"}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className="flex items-center gap-1 font-mono text-[10px] uppercase text-muted-foreground transition-colors hover:text-foreground"
              title="Start New Chat"
            >
              <IconPlus className="size-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto"
          aria-live="polite"
          aria-busy={isStreaming}
        >
          <ChatThread
            messages={data?.messages ?? []}
            pendingUserMessage={pendingUser}
            streamingText={text}
            isStreaming={isStreaming}
            isLoading={isLoading && Boolean(activeId)}
            onSuggestion={(s) => setPrefill(s)}
          />
        </div>

        <Composer
          onSend={handleSend}
          onStop={stop}
          isStreaming={isStreaming}
          prefill={prefill}
        />

        {status === "aborted" && (
          <p className="px-4 pb-2 font-mono text-[10px] text-muted-foreground">
            [SYS] Generation stopped by user.
          </p>
        )}
      </section>
    </div>
  );
}

function CommunityChatShell() {
  const { onlineCount } = useSocket();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    rooms,
    messages,
    typingUsers,
    isLoadingMessages,
    sendMessage,
    startTyping,
    stopTyping,
    toggleReaction,
  } = useCommunityChat(selectedRoomId);

  // Auto-select first channel if none selected
  if (!selectedRoomId && rooms.length > 0) {
    const firstRoom = rooms[0];
    const firstId = firstRoom._id || firstRoom.id || firstRoom.slug;
    setSelectedRoomId(firstId);
  }

  const currentRoom = rooms.find(
    (r) => (r._id || r.id || r.slug) === selectedRoomId
  );

  const handleSelectRoom = (id: string) => {
    setSelectedRoomId(id);
    setDrawerOpen(false);
  };

  const roomList = (
    <RoomList
      rooms={rooms}
      selectedRoomId={selectedRoomId}
      onSelectRoom={handleSelectRoom}
      onlineCount={onlineCount}
    />
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col md:flex-row md:gap-4">
      <aside className="hidden shrink-0 md:block md:w-64 lg:w-72">
        {roomList}
      </aside>

      {/* Mobile Channel Selector Drawer */}
      <div className="mb-3 md:hidden">
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2 truncate">
                <IconUsers className="size-4 shrink-0" />
                <span className="truncate">#{currentRoom?.name || "Channels"}</span>
              </span>
              <span className="shrink-0 font-mono text-[10px] uppercase text-muted-foreground">Switch Room</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[75vh] p-4">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-sm">Community Channels</DrawerTitle>
            </DrawerHeader>
            <div className="min-h-0 flex-1 overflow-y-auto">{roomList}</div>
          </DrawerContent>
        </Drawer>
      </div>

      <section className="flex min-h-0 flex-1 flex-col">
        <CommunityChatThread
          roomName={currentRoom?.name || "general"}
          messages={messages}
          typingUsers={typingUsers}
          isLoading={isLoadingMessages}
          onSendMessage={sendMessage}
          onStartTyping={startTyping}
          onStopTyping={stopTyping}
          onToggleReaction={toggleReaction}
        />
      </section>
    </div>
  );
}
