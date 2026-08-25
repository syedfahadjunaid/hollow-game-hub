"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
  IconHelp,
  IconX,
  IconSend,
  IconSparkles,
  IconMinus,
  IconRefresh,
  IconCoins,
  IconSwords,
  IconShield,
  IconDeviceGamepad2,
  IconUser,
  IconRobot,
} from "@tabler/icons-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card } from "./card";
import { askHelpAction, getHelpFaqsAction, IHelpAskResponse } from "@/app/actions/help-actions";
import { playCorrectSound, playWrongSound } from "@/lib/sound";
import { toast } from "react-hot-toast";

interface IMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolResults?: any[];
  timestamp: string;
}

const QUICK_SUGGESTIONS = [
  { label: "🪙 Earn Coins", prompt: "How do I earn more Coins and Gems on Hollow Game Hub?" },
  { label: "⚔️ PvP Duels", prompt: "How do PvP multiplayer duels and Elo ratings work?" },
  { label: "🛡️ Clan Vault", prompt: "How do clans work, and what are the benefits of the Clan Vault?" },
  { label: "🎮 Wordle Tips", prompt: "What are the rules and best winning strategies for Wordle?" },
  { label: "📊 My Stats", prompt: "Can you check my live account overview, coins balance, and clan stats?" },
];

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<IMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Greetings, player! 👾 I am **HollowGuide**, your 8-bit platform support assistant. Ask me about game rules, coins, clans, PvP duels, or check your stats!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isPending, startTransition] = useTransition();
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized, messages, isStreaming]);

  const handleSend = async (messageText?: string) => {
    const query = (messageText || input).trim();
    if (!query || isPending || isStreaming) return;

    setInput("");
    const userMsgId = Date.now().toString();
    const newMsg: IMessage = {
      id: userMsgId,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    playCorrectSound();

    // Attempt streaming first via Next.js SSE proxy
    try {
      setIsStreaming(true);
      const res = await fetch("/api/help/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, conversationId }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Stream unavailable, falling back to server action");
      }

      const assistantMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: "assistant",
          content: "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamedAnswer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.replace("data: ", "").trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.token) {
              streamedAnswer += parsed.token;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId ? { ...m, content: streamedAnswer } : m
                )
              );
            }
            if (parsed.conversationId) {
              setConversationId(parsed.conversationId);
            }
          } catch {
            // Partial chunk
          }
        }
      }
      setIsStreaming(false);
    } catch {
      // Fallback to Server Action if streaming encounters an error
      setIsStreaming(false);
      startTransition(async () => {
        const res = await askHelpAction(query, conversationId);
        if (res.success && res.data) {
          if (res.data.conversationId) setConversationId(res.data.conversationId);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: res.data!.answer,
              toolResults: res.data!.toolResults,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        } else {
          playWrongSound();
          toast.error(res.error || "HollowGuide is temporarily offline");
        }
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setConversationId(undefined);
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: "Chat session refreshed! How can I assist you with Hollow Game Hub?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-card hover:bg-card/90 border-2 border-primary text-primary px-3.5 py-2.5 rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] transition-transform hover:-translate-y-0.5 active:translate-y-0 group font-mono text-xs"
          title="Open HollowGuide Support AI"
        >
          <div className="relative">
            <IconRobot className="size-5 text-primary animate-bounce" />
            <span className="absolute -top-1 -right-1 size-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 size-2 bg-emerald-500 rounded-full" />
          </div>
          <span className="font-extrabold uppercase tracking-wide hidden sm:inline">
            HollowGuide AI
          </span>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px] px-1 py-0 hidden sm:inline">
            HELP
          </Badge>
        </button>
      )}

      {/* Floating Support Modal Window */}
      {isOpen && (
        <div
          className={`fixed bottom-5 right-4 sm:right-6 z-50 flex flex-col bg-card border-2 border-primary rounded-none shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.25)] transition-all duration-200 overflow-hidden font-mono ${
            isMinimized
              ? "w-72 h-12"
              : "w-[94vw] sm:w-[430px] h-[540px] max-h-[85vh]"
          }`}
        >
          {/* 8-Bit CRT Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-primary text-primary-foreground border-b-2 border-primary select-none">
            <div className="flex items-center gap-2">
              <IconRobot className="size-4 shrink-0" />
              <span className="font-extrabold text-xs tracking-wider uppercase truncate">
                HollowGuide Desk
              </span>
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="p-1 hover:bg-black/20 text-primary-foreground/80 hover:text-white transition-colors"
                title="New Chat Session"
              >
                <IconRefresh className="size-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-black/20 text-primary-foreground/80 hover:text-white transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <IconMinus className="size-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-black/20 text-primary-foreground/80 hover:text-white transition-colors"
                title="Close"
              >
                <IconX className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Main Chat Body (if not minimized) */}
          {!isMinimized && (
            <div className="flex flex-col flex-1 overflow-hidden bg-background/95">
              {/* Quick FAQ Chips Carousel */}
              <div className="flex items-center gap-1.5 p-2 bg-muted/40 border-b border-border overflow-x-auto scrollbar-none text-[11px]">
                {QUICK_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    disabled={isPending || isStreaming}
                    className="shrink-0 px-2 py-1 bg-card hover:bg-primary/20 border border-primary/40 hover:border-primary text-foreground rounded-none transition-colors disabled:opacity-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] p-2.5 text-xs rounded-none border leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]"
                          : "bg-muted/70 text-foreground border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {msg.content || (
                          <span className="animate-pulse text-muted-foreground">Thinking...</span>
                        )}
                        {msg.role === "assistant" && isStreaming && msg.id === messages[messages.length - 1]?.id && (
                          <span className="inline-block w-1.5 h-3.5 bg-primary ml-1 animate-pulse" />
                        )}
                      </div>

                      {/* Tool Result Renderers (e.g. Account Stats Card) */}
                      {msg.toolResults && msg.toolResults.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-border/50 space-y-1.5 text-[11px]">
                          {msg.toolResults.map((t, idx) => {
                            if (t.name === "getUserAccountOverview" && t.data && !t.data.error) {
                              return (
                                <div
                                  key={idx}
                                  className="bg-card/80 p-2 border border-primary/40 space-y-1 text-primary"
                                >
                                  <div className="font-bold flex items-center gap-1 border-b border-primary/20 pb-1">
                                    <IconUser className="size-3" /> Live Player Dossier
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
                                    <div>⭐ Level: <span className="text-foreground font-bold">{t.data.level}</span></div>
                                    <div>🪙 Coins: <span className="text-amber-400 font-bold">{t.data.coins}</span></div>
                                    <div>💎 Gems: <span className="text-cyan-400 font-bold">{t.data.gems}</span></div>
                                    <div>🔥 Streak: <span className="text-orange-400 font-bold">{t.data.streak}d</span></div>
                                    <div>⚔️ PvP Elo: <span className="text-indigo-400 font-bold">{t.data.pvpRating}</span></div>
                                    <div>🛡️ Clan: <span className="text-foreground font-bold">{t.data.guild ? `[${t.data.guild.tag}] ${t.data.guild.name}` : "None"}</span></div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-muted-foreground mt-0.5 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input & Action Bar */}
              <div className="p-2.5 bg-card border-t-2 border-border flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask a question or game rule..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isPending || isStreaming}
                  className="flex-1 bg-background border border-primary/40 focus:border-primary text-foreground text-xs px-2.5 py-1.5 outline-none rounded-none placeholder:text-muted-foreground/60 disabled:opacity-50"
                  maxLength={400}
                />
                <Button
                  size="sm"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isPending || isStreaming}
                  className="px-3 py-1.5 h-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                >
                  <IconSend className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
