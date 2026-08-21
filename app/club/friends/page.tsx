"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconUsers,
  IconUserPlus,
  IconMessageCircle,
  IconSwords,
  IconCheck,
  IconX,
  IconSend,
  IconBan,
  IconCircleFilled,
} from "@tabler/icons-react";
import { toast } from "sonner";

import {
  getFriendsAction,
  getPendingRequestsAction,
  sendFriendRequestAction,
  respondFriendRequestAction,
  getDirectMessagesAction,
  markDirectMessagesReadAction,
  blockUserAction,
  IFriendUser,
  IFriendship,
  IDirectMessage,
  IDirectChannel,
} from "@/app/actions/friends-actions";
import { useSocket } from "@/lib/socket/SocketContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/badge";

export default function FriendsPage() {
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "add">("friends");
  const [friends, setFriends] = useState<IFriendUser[]>([]);
  const [incoming, setIncoming] = useState<IFriendship[]>([]);
  const [outgoing, setOutgoing] = useState<IFriendship[]>([]);
  const [searchTarget, setSearchTarget] = useState("");
  const [isPending, startTransition] = useTransition();

  // Active Direct Message Chat state
  const [activeFriend, setActiveFriend] = useState<IFriendUser | null>(null);
  const [activeChannel, setActiveChannel] = useState<IDirectChannel | null>(null);
  const [messages, setMessages] = useState<IDirectMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    const [friendsRes, reqsRes] = await Promise.all([
      getFriendsAction(),
      getPendingRequestsAction(),
    ]);

    if (friendsRes.success && friendsRes.friends) {
      setFriends(friendsRes.friends);
    }
    if (reqsRes.success) {
      if (reqsRes.incoming) setIncoming(reqsRes.incoming);
      if (reqsRes.outgoing) setOutgoing(reqsRes.outgoing);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Socket.IO event listeners for real-time DMs
  useEffect(() => {
    if (!socket || !activeChannel) return;

    const channelId = activeChannel.id || activeChannel._id;
    socket.emit("dm_join", { channelId });

    const handleReceiveMessage = (msg: IDirectMessage) => {
      setMessages((prev) => [...prev, msg]);
      setIsFriendTyping(false);
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleTypingStart = (data: { channelId: string }) => {
      if (data.channelId === channelId) {
        setIsFriendTyping(true);
      }
    };

    const handleTypingStop = (data: { channelId: string }) => {
      if (data.channelId === channelId) {
        setIsFriendTyping(false);
      }
    };

    socket.on("dm_receive_message", handleReceiveMessage);
    socket.on("dm_typing_start", handleTypingStart);
    socket.on("dm_typing_stop", handleTypingStop);

    return () => {
      socket.emit("dm_leave", { channelId });
      socket.off("dm_receive_message", handleReceiveMessage);
      socket.off("dm_typing_start", handleTypingStart);
      socket.off("dm_typing_stop", handleTypingStop);
    };
  }, [socket, activeChannel]);

  // Open Direct Message modal with a friend
  const openChatWithFriend = async (friend: IFriendUser) => {
    setActiveFriend(friend);
    const res = await getDirectMessagesAction(friend.id || friend._id || "");
    if (res.success) {
      setActiveChannel(res.channel || null);
      setMessages(res.messages || []);
      if (res.channel) {
        markDirectMessagesReadAction(res.channel.id || res.channel._id || "");
      }
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      toast.error("Could not open chat", { description: res.error });
    }
  };

  // Send Direct Message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChannel || !socket) return;
    const channelId = activeChannel.id || activeChannel._id;
    const content = inputMessage.trim();

    socket.emit("dm_send_message", {
      channelId,
      content,
      messageType: "text",
    });

    setInputMessage("");
  };

  // Send PvP Match Invitation in DM
  const handleSendGameInvite = (gameSlug = "rps") => {
    if (!activeChannel || !socket) return;
    const channelId = activeChannel.id || activeChannel._id;

    socket.emit("dm_send_message", {
      channelId,
      content: `⚔️ Challenge! Let's play a ${gameSlug.toUpperCase()} duel!`,
      messageType: "game_invite",
      metadata: { gameSlug, lobbyCode: Math.random().toString(36).substring(2, 8).toUpperCase() },
    });
    toast.success("Game invite sent in chat!");
  };

  // Send Friend Request
  const handleSendRequest = () => {
    if (!searchTarget.trim()) return;
    startTransition(async () => {
      const res = await sendFriendRequestAction(searchTarget.trim());
      if (res.success) {
        toast.success("Friend request sent!", {
          description: `Invitation delivered to ${searchTarget.trim()}`,
        });
        setSearchTarget("");
        loadData();
      } else {
        toast.error("Could not send request", { description: res.error });
      }
    });
  };

  // Respond to request
  const handleRespond = (friendshipId: string, action: "accept" | "decline") => {
    startTransition(async () => {
      const res = await respondFriendRequestAction(friendshipId, action);
      if (res.success) {
        toast.success(action === "accept" ? "Friend request accepted!" : "Request declined.");
        loadData();
      } else {
        toast.error("Action failed", { description: res.error });
      }
    });
  };

  // Block user
  const handleBlock = (targetId: string) => {
    startTransition(async () => {
      const res = await blockUserAction(targetId);
      if (res.success) {
        toast.success("User blocked.");
        loadData();
      } else {
        toast.error("Block failed", { description: res.error });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 sm:p-6 border-2 border-foreground dark:border-ring shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Image
              src="/images/pixel-gamepad.gif"
              alt="Gamepad"
              width={24}
              height={24}
              className="size-6 object-contain pixelated"
              unoptimized
            />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide font-mono uppercase">
              Friends & Direct Messaging
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Connect with retro arcade rivals, send real-time private messages, and issue 1v1 PvP challenges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-mono text-xs">
            {friends.length} Friends
          </Badge>
          {incoming.length > 0 && (
            <Badge className="bg-amber-500/10 border-amber-500/30 text-amber-400 font-mono text-xs animate-pulse">
              {incoming.length} New Requests
            </Badge>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Button
          variant={activeTab === "friends" ? "default" : "ghost"}
          onClick={() => setActiveTab("friends")}
          className="flex items-center gap-2 font-mono text-xs sm:text-sm"
        >
          <IconUsers className="size-4" />
          <span>My Friends ({friends.length})</span>
        </Button>
        <Button
          variant={activeTab === "requests" ? "default" : "ghost"}
          onClick={() => setActiveTab("requests")}
          className="flex items-center gap-2 font-mono text-xs sm:text-sm"
        >
          <IconMessageCircle className="size-4" />
          <span>Requests ({incoming.length})</span>
        </Button>
        <Button
          variant={activeTab === "add" ? "default" : "ghost"}
          onClick={() => setActiveTab("add")}
          className="flex items-center gap-2 font-mono text-xs sm:text-sm"
        >
          <IconUserPlus className="size-4" />
          <span>Add Friend</span>
        </Button>
      </div>

      {/* FRIENDS LIST TAB */}
      {activeTab === "friends" && (
        <div className="space-y-4">
          {friends.length === 0 ? (
            <div className="p-8 text-center bg-card border border-border text-muted-foreground font-mono text-sm">
              You haven&apos;t added any friends yet. Switch to &quot;Add Friend&quot; to invite fellow players!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <Card key={friend.id || friend._id} className="flex flex-col justify-between">
                  <CardHeader className="space-y-2 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconCircleFilled className="size-3 text-emerald-400" />
                        <span className="text-xs font-mono text-emerald-400">Online</span>
                      </div>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        LVL {friend.level || 1}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold font-mono truncate">
                      {friend.name || friend.displayName || friend.email}
                    </CardTitle>
                    <CardDescription className="text-xs truncate font-mono">
                      {friend.email}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-2 space-y-2 border-t border-border/60">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => openChatWithFriend(friend)}
                        className="flex-1 text-xs font-mono h-8 flex items-center gap-1.5"
                      >
                        <IconMessageCircle className="size-3.5" />
                        <span>Chat DM</span>
                      </Button>
                      <Link href="/club/pvp" className="flex-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full text-xs font-mono h-8 flex items-center gap-1.5"
                        >
                          <IconSwords className="size-3.5 text-amber-400" />
                          <span>Duel PvP</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FRIEND REQUESTS TAB */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          {/* Incoming Requests */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono uppercase text-amber-400">
              Incoming Requests ({incoming.length})
            </h3>
            {incoming.length === 0 ? (
              <div className="p-4 text-center bg-card border border-border text-muted-foreground font-mono text-xs">
                No pending incoming friend requests.
              </div>
            ) : (
              <div className="space-y-2">
                {incoming.map((req) => (
                  <div
                    key={req.id || req._id}
                    className="p-3 bg-card border border-border flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="font-mono text-sm font-bold block">
                        {req.friend?.name || req.friend?.email || "Unknown Player"}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        Sent on {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        disabled={isPending}
                        onClick={() => handleRespond(req.id || req._id || "", "accept")}
                        className="text-xs font-mono h-7 flex items-center gap-1"
                      >
                        <IconCheck className="size-3.5" />
                        <span>Accept</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => handleRespond(req.id || req._id || "", "decline")}
                        className="text-xs font-mono h-7 flex items-center gap-1"
                      >
                        <IconX className="size-3.5" />
                        <span>Decline</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing Requests */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono uppercase text-muted-foreground">
              Sent Invitations ({outgoing.length})
            </h3>
            {outgoing.length === 0 ? (
              <div className="p-4 text-center bg-card border border-border text-muted-foreground font-mono text-xs">
                No active sent requests.
              </div>
            ) : (
              <div className="space-y-2">
                {outgoing.map((req) => (
                  <div
                    key={req.id || req._id}
                    className="p-3 bg-card border border-border flex items-center justify-between"
                  >
                    <span className="font-mono text-sm">
                      {req.friend?.name || req.friend?.email || "Player"}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      PENDING ACCEPTANCE
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD FRIEND TAB */}
      {activeTab === "add" && (
        <Card className="max-w-xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-bold font-mono uppercase">
              Send Player Invitation
            </CardTitle>
            <CardDescription className="text-xs">
              Enter a player&apos;s registered email address or user ID to send a friend request.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="player@example.com or user ID"
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border-2 border-foreground dark:border-ring text-sm font-mono focus:outline-hidden"
              />
              <Button
                variant="default"
                disabled={isPending || !searchTarget.trim()}
                onClick={handleSendRequest}
                className="font-mono text-xs"
              >
                {isPending ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DIRECT MESSAGE MODAL / DRAWER */}
      {activeFriend && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <Card className="w-full max-w-xl h-[550px] bg-card border-2 border-foreground dark:border-ring flex flex-col justify-between">
            {/* DM Header */}
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <IconCircleFilled className="size-3 text-emerald-400" />
                <div>
                  <CardTitle className="text-base font-bold font-mono">
                    {activeFriend.name || activeFriend.email}
                  </CardTitle>
                  <CardDescription className="text-[11px] font-mono">
                    Direct Private Channel
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleSendGameInvite("rps")}
                  className="text-xs font-mono h-7 flex items-center gap-1"
                >
                  <IconSwords className="size-3.5 text-amber-400" />
                  <span>Send Challenge</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveFriend(null)}
                  className="size-7 p-0"
                >
                  <IconX className="size-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages Scroll Area */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground font-mono text-xs">
                  No messages yet. Say hello or send a game challenge!
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderId !== activeFriend.id && msg.senderId !== activeFriend._id;
                  return (
                    <div
                      key={msg.id || msg._id || idx}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-2.5 rounded-none font-mono text-xs ${
                          isMe
                            ? "bg-foreground text-background dark:bg-ring dark:text-background"
                            : "bg-muted/80 border border-border"
                        }`}
                      >
                        {msg.messageType === "game_invite" ? (
                          <div className="space-y-2">
                            <span className="font-bold text-amber-400 block">
                              {msg.content}
                            </span>
                            <Link href="/club/pvp">
                              <Button size="sm" variant="default" className="text-[10px] h-6 w-full">
                                Join Duel Room
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <span>{msg.content}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                })
              )}
              {isFriendTyping && (
                <div className="text-xs text-muted-foreground font-mono italic animate-pulse">
                  {activeFriend.name || "Friend"} is typing...
                </div>
              )}
              <div ref={chatBottomRef} />
            </CardContent>

            {/* Message Input Box */}
            <div className="p-3 border-t border-border flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a direct message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                className="flex-1 px-3 py-2 bg-background border border-border text-xs font-mono focus:outline-hidden"
              />
              <Button
                variant="default"
                size="sm"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="text-xs font-mono h-8 flex items-center gap-1"
              >
                <IconSend className="size-3.5" />
                <span>Send</span>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
