"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import Image from "next/image";
import {
  IconShield,
  IconShieldCheck,
  IconCoins,
  IconPlus,
  IconSearch,
  IconUsers,
  IconMessageCircle,
  IconSparkles,
  IconDoorExit,
  IconCrown,
  IconSend,
} from "@tabler/icons-react";
import { toast } from "sonner";

import {
  getMyGuildAction,
  searchGuildsAction,
  createGuildAction,
  joinGuildAction,
  leaveGuildAction,
  depositVaultAction,
  getGuildMessagesAction,
  kickGuildMemberAction,
  IGuild,
  IGuildChatMessage,
} from "@/app/actions/guild-actions";
import { useSocket } from "@/lib/socket/SocketContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/badge";

export default function GuildsPage() {
  const { socket } = useSocket();
  const [myGuild, setMyGuild] = useState<IGuild | null>(null);
  const [directory, setDirectory] = useState<IGuild[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Create Guild Form Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClanName, setNewClanName] = useState("");
  const [newClanTag, setNewClanTag] = useState("");
  const [newClanDesc, setNewClanDesc] = useState("");
  const [newClanEmblem, setNewClanEmblem] = useState("shield-gold");

  // Squad HQ Tab State
  const [guildTab, setGuildTab] = useState<"hq" | "roster" | "chat">("hq");
  const [chatMessages, setChatMessages] = useState<IGuildChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [depositAmount, setDepositAmount] = useState(100);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    const [myRes, dirRes] = await Promise.all([
      getMyGuildAction(),
      searchGuildsAction(),
    ]);

    if (myRes.success && myRes.guild) {
      setMyGuild(myRes.guild);
      loadChatHistory(myRes.guild.id || myRes.guild._id || "");
    } else {
      setMyGuild(null);
    }

    if (dirRes.success && dirRes.guilds) {
      setDirectory(dirRes.guilds);
    }
  };

  const loadChatHistory = async (guildId: string) => {
    const res = await getGuildMessagesAction(guildId);
    if (res.success && res.messages) {
      setChatMessages(res.messages);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Socket.IO event listeners for real-time Squad Chat
  useEffect(() => {
    if (!socket || !myGuild) return;
    const guildId = myGuild.id || myGuild._id;
    socket.emit("guild_join", { guildId });

    const handleReceiveMessage = (msg: IGuildChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    socket.on("guild_receive_message", handleReceiveMessage);

    return () => {
      socket.emit("guild_leave", { guildId });
      socket.off("guild_receive_message", handleReceiveMessage);
    };
  }, [socket, myGuild]);

  const handleCreateGuild = () => {
    if (!newClanName.trim() || !newClanTag.trim()) {
      toast.error("Clan Name and Tag are required.");
      return;
    }

    startTransition(async () => {
      const res = await createGuildAction({
        name: newClanName.trim(),
        tag: newClanTag.trim().toUpperCase(),
        description: newClanDesc.trim(),
        emblem: newClanEmblem,
      });

      if (res.success && res.guild) {
        toast.success(`Clan [${res.guild.tag}] ${res.guild.name} founded!`);
        setShowCreateModal(false);
        loadData();
      } else {
        toast.error("Could not create clan", { description: res.error });
      }
    });
  };

  const handleJoinGuild = (guildId: string) => {
    startTransition(async () => {
      const res = await joinGuildAction(guildId);
      if (res.success && res.guild) {
        toast.success(`Joined [${res.guild.tag}] ${res.guild.name}!`);
        loadData();
      } else {
        toast.error("Could not join clan", { description: res.error });
      }
    });
  };

  const handleLeaveGuild = () => {
    if (!myGuild) return;
    startTransition(async () => {
      const res = await leaveGuildAction(myGuild.id || myGuild._id || "");
      if (res.success) {
        toast.success("Left clan.");
        loadData();
      } else {
        toast.error("Could not leave clan", { description: res.error });
      }
    });
  };

  const handleDepositVault = () => {
    if (!myGuild || depositAmount <= 0) return;
    startTransition(async () => {
      const res = await depositVaultAction(myGuild.id || myGuild._id || "", depositAmount);
      if (res.success) {
        toast.success(`Deposited ${depositAmount} Coins to Clan Vault!`);
        loadData();
      } else {
        toast.error("Deposit failed", { description: res.error });
      }
    });
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim() || !socket || !myGuild) return;
    const guildId = myGuild.id || myGuild._id;
    socket.emit("guild_send_message", {
      guildId,
      content: chatInput.trim(),
    });
    setChatInput("");
  };

  const handleKickMember = (targetUserId: string) => {
    if (!myGuild) return;
    startTransition(async () => {
      const res = await kickGuildMemberAction(myGuild.id || myGuild._id || "", targetUserId);
      if (res.success) {
        toast.success("Member removed from clan.");
        loadData();
      } else {
        toast.error("Kick failed", { description: res.error });
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
              alt="Shield"
              width={24}
              height={24}
              className="size-6 object-contain pixelated"
              unoptimized
            />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide font-mono uppercase">
              Guilds, Clans & Squads
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Form alliances, pool coins in the Clan Vault to unlock group XP boosters, and coordinate squad duels.
          </p>
        </div>

        {myGuild ? (
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 font-mono text-xs">
              [{myGuild.tag}] LVL {myGuild.level}
            </Badge>
          </div>
        ) : (
          <Button
            variant="default"
            onClick={() => setShowCreateModal(true)}
            className="font-mono text-xs h-9 flex items-center gap-1.5 bg-amber-500 text-black font-bold"
          >
            <IconPlus className="size-4" />
            <span>Found a Clan (250 🪙)</span>
          </Button>
        )}
      </div>

      {/* VIEW A: PLAYER IS IN A GUILD (SQUAD HEADQUARTERS) */}
      {myGuild ? (
        <div className="space-y-6">
          {/* Clan Banner Card */}
          <Card className="border-2 border-foreground dark:border-ring">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center">
                    <IconShieldCheck className="size-7 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-mono font-black text-lg sm:text-xl">
                        [{myGuild.tag}]
                      </span>
                      <CardTitle className="text-lg sm:text-xl font-bold font-mono">
                        {myGuild.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      {myGuild.description}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 bg-muted/40 border border-border text-center">
                    <span className="text-[10px] text-muted-foreground font-mono block">MEMBERS</span>
                    <span className="text-sm font-bold font-mono">{myGuild.memberIds?.length || 1} / 50</span>
                  </div>
                  <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-center">
                    <span className="text-[10px] text-amber-400 font-mono block">VAULT</span>
                    <span className="text-sm font-bold font-mono text-amber-400">🪙 {myGuild.vaultCoins}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">Clan Level {myGuild.level}</span>
                <span className="text-amber-400 font-bold">{myGuild.xp} XP</span>
              </div>
              <div className="w-full bg-muted h-2 border border-border overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, ((myGuild.xp % 2000) / 2000) * 100)}%` }}
                />
              </div>

              {/* Active Clan Perks */}
              <div className="flex flex-wrap gap-2 pt-2">
                {myGuild.perks?.map((perk) => (
                  <Badge key={perk} variant="outline" className="font-mono text-[10px] border-emerald-500/40 text-emerald-400">
                    <IconSparkles className="size-3 mr-1" /> {perk}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sub-Navigation */}
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <Button
              variant={guildTab === "hq" ? "default" : "ghost"}
              onClick={() => setGuildTab("hq")}
              className="text-xs font-mono h-8 flex items-center gap-1.5"
            >
              <IconShield className="size-3.5" />
              <span>Headquarters & Vault</span>
            </Button>
            <Button
              variant={guildTab === "roster" ? "default" : "ghost"}
              onClick={() => setGuildTab("roster")}
              className="text-xs font-mono h-8 flex items-center gap-1.5"
            >
              <IconUsers className="size-3.5" />
              <span>Roster ({myGuild.members?.length || myGuild.memberIds?.length || 1})</span>
            </Button>
            <Button
              variant={guildTab === "chat" ? "default" : "ghost"}
              onClick={() => setGuildTab("chat")}
              className="text-xs font-mono h-8 flex items-center gap-1.5"
            >
              <IconMessageCircle className="size-3.5" />
              <span>Squad Chat</span>
            </Button>
          </div>

          {/* HQ & VAULT VIEW */}
          {guildTab === "hq" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vault Deposit Box */}
              <Card>
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-base font-bold font-mono flex items-center gap-2">
                    <IconCoins className="size-4 text-amber-400" />
                    <span>Clan Vault Deposit Box</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Every 2 Coins deposited grants +1 XP towards your clan&apos;s level perks.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 250, 500].map((amt) => (
                      <Button
                        key={amt}
                        size="sm"
                        variant={depositAmount === amt ? "default" : "secondary"}
                        onClick={() => setDepositAmount(amt)}
                        className="text-xs font-mono h-8"
                      >
                        🪙 {amt}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="default"
                    disabled={isPending}
                    onClick={handleDepositVault}
                    className="w-full font-mono text-xs h-9 bg-amber-500 text-black font-bold"
                  >
                    {isPending ? "Depositing..." : `Deposit ${depositAmount} Coins`}
                  </Button>
                </CardContent>
              </Card>

              {/* Clan Management Actions */}
              <Card>
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-base font-bold font-mono">Clan Settings</CardTitle>
                  <CardDescription className="text-xs">
                    Leader tools and membership options.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={handleLeaveGuild}
                    className="w-full font-mono text-xs h-8 flex items-center justify-center gap-1.5"
                  >
                    <IconDoorExit className="size-3.5" />
                    <span>Leave Clan</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ROSTER VIEW */}
          {guildTab === "roster" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold font-mono">Member Roster</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {myGuild.members?.map((member) => (
                    <div
                      key={member.id || member._id}
                      className="p-3 sm:p-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        {member.role === "leader" && <IconCrown className="size-4 text-amber-400" />}
                        <span className="font-mono text-sm font-bold">
                          {member.name || member.email || `Player ${member.id?.slice(-4)}`}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono uppercase">
                          {member.role}
                        </Badge>
                      </div>

                      {member.role !== "leader" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleKickMember(member.id || member._id || "")}
                          className="text-[10px] text-rose-400 font-mono h-6 px-2"
                        >
                          Kick
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SQUAD CHAT VIEW */}
          {guildTab === "chat" && (
            <Card className="h-[500px] flex flex-col justify-between">
              <CardHeader className="pb-2 border-b border-border">
                <CardTitle className="text-sm font-bold font-mono">Real-Time Squad Radio</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-muted-foreground font-mono text-xs">
                    No squad messages yet. Send a broadcast to your clan!
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div key={msg.id || msg._id || idx} className="space-y-0.5 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400">{msg.senderName}:</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-muted-foreground pl-2 border-l border-border">{msg.content}</p>
                    </div>
                  ))
                )}
                <div ref={chatBottomRef} />
              </CardContent>

              <div className="p-3 border-t border-border flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Broadcast to squad..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendChatMessage();
                  }}
                  className="flex-1 px-3 py-2 bg-background border border-border text-xs font-mono focus:outline-hidden"
                />
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleSendChatMessage}
                  disabled={!chatInput.trim()}
                  className="text-xs font-mono h-8 flex items-center gap-1"
                >
                  <IconSend className="size-3.5" />
                  <span>Send</span>
                </Button>
              </div>
            </Card>
          )}
        </div>
      ) : (
        /* VIEW B: PLAYER HAS NO GUILD (DIRECTORY & DISCOVERY) */
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search clans by name or [TAG]..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background border-2 border-foreground dark:border-ring text-xs font-mono focus:outline-hidden"
              />
            </div>
            <Button
              variant="default"
              onClick={() => searchGuildsAction(searchQuery).then((res) => res.success && setDirectory(res.guilds || []))}
              className="font-mono text-xs"
            >
              Search
            </Button>
          </div>

          {/* Clans Directory Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {directory.map((clan) => (
              <Card key={clan.id || clan._id} className="flex flex-col justify-between">
                <CardHeader className="space-y-1.5 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-mono font-black text-sm">[{clan.tag}]</span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      LVL {clan.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold font-mono">{clan.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{clan.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-2 space-y-3 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>{clan.memberCount || clan.memberIds?.length || 1} Members</span>
                    <span>Min LVL {clan.minLevel}</span>
                  </div>

                  <Button
                    size="sm"
                    variant="default"
                    disabled={isPending}
                    onClick={() => handleJoinGuild(clan.id || clan._id || "")}
                    className="w-full text-xs font-mono h-8"
                  >
                    Join Clan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* FOUND CLAN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-2 border-foreground dark:border-ring">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-bold font-mono uppercase">
                Found a New Clan
              </CardTitle>
              <CardDescription className="text-xs">
                Creating a clan costs 250 coins and unlocks your squad headquarters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground">Clan Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Cyber Blades"
                  value={newClanName}
                  onChange={(e) => setNewClanName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground">Clan Tag (Max 5 chars):</label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="e.g. VOID"
                  value={newClanTag}
                  onChange={(e) => setNewClanTag(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-background border border-border text-xs font-mono uppercase font-bold tracking-widest focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground">Motto / Description:</label>
                <textarea
                  rows={2}
                  placeholder="A proud retro arcade clan."
                  value={newClanDesc}
                  onChange={(e) => setNewClanDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="ghost"
                  className="flex-1 text-xs font-mono"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  disabled={isPending || !newClanName.trim() || !newClanTag.trim()}
                  onClick={handleCreateGuild}
                  className="flex-1 text-xs font-mono bg-amber-500 text-black font-bold"
                >
                  {isPending ? "Founding..." : "Found (250 🪙)"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
