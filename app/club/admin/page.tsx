"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import {
  IconShieldLock,
  IconUsers,
  IconCoins,
  IconDiamond,
  IconAlertTriangle,
  IconGavel,
  IconFileText,
  IconBan,
  IconCheck,
  IconSearch,
  IconPlus,
} from "@tabler/icons-react";
import { toast } from "sonner";

import {
  getAdminStatsAction,
  getAdminUsersAction,
  banUserAction,
  unbanUserAction,
  setUserRoleAction,
  grantUserCurrencyAction,
  getAdminReportsAction,
  resolveReportAction,
  getAuditLogsAction,
  IAdminStats,
  IAdminUser,
  IModerationReport,
  IAuditLog,
} from "@/app/actions/admin-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "reports" | "logs">("overview");
  const [stats, setStats] = useState<IAdminStats | null>(null);
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [reports, setReports] = useState<IModerationReport[]>([]);
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Ban Modal
  const [selectedBanUser, setSelectedBanUser] = useState<IAdminUser | null>(null);
  const [banReason, setBanReason] = useState("Violation of Community Guidelines");
  const [banDays, setBanDays] = useState(7);

  // Grant Currency Modal
  const [selectedGrantUser, setSelectedGrantUser] = useState<IAdminUser | null>(null);
  const [grantCoins, setGrantCoins] = useState(100);
  const [grantGems, setGrantGems] = useState(0);
  const [grantReason, setGrantReason] = useState("Tournament Prize");

  // Resolve Report Modal
  const [selectedReport, setSelectedReport] = useState<IModerationReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const loadData = async () => {
    const [statsRes, usersRes, reportsRes, logsRes] = await Promise.all([
      getAdminStatsAction(),
      getAdminUsersAction({ limit: 20 }),
      getAdminReportsAction(),
      getAuditLogsAction(30),
    ]);

    if (statsRes.success && statsRes.stats) setStats(statsRes.stats);
    if (usersRes.success && usersRes.users) setUsers(usersRes.users);
    if (reportsRes.success && reportsRes.reports) setReports(reportsRes.reports);
    if (logsRes.success && logsRes.logs) setLogs(logsRes.logs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearchUsers = () => {
    startTransition(async () => {
      const res = await getAdminUsersAction({ search: userSearch });
      if (res.success && res.users) {
        setUsers(res.users);
      }
    });
  };

  const handleBanUser = () => {
    if (!selectedBanUser) return;
    startTransition(async () => {
      const res = await banUserAction(selectedBanUser.id || selectedBanUser._id || "", banReason, banDays);
      if (res.success) {
        toast.success(`Account for ${selectedBanUser.name || selectedBanUser.email} suspended.`);
        setSelectedBanUser(null);
        loadData();
      } else {
        toast.error("Ban failed", { description: res.error });
      }
    });
  };

  const handleUnbanUser = (userId: string) => {
    startTransition(async () => {
      const res = await unbanUserAction(userId);
      if (res.success) {
        toast.success("Account unsuspended.");
        loadData();
      } else {
        toast.error("Unban failed", { description: res.error });
      }
    });
  };

  const handleRoleChange = (userId: string, role: "user" | "moderator" | "admin") => {
    startTransition(async () => {
      const res = await setUserRoleAction(userId, role);
      if (res.success) {
        toast.success(`Role updated to ${role}.`);
        loadData();
      } else {
        toast.error("Role update failed", { description: res.error });
      }
    });
  };

  const handleGrantCurrency = () => {
    if (!selectedGrantUser) return;
    startTransition(async () => {
      const res = await grantUserCurrencyAction(selectedGrantUser.id || selectedGrantUser._id || "", {
        coins: grantCoins,
        gems: grantGems,
        reason: grantReason,
      });
      if (res.success) {
        toast.success("Currency grant processed.");
        setSelectedGrantUser(null);
        loadData();
      } else {
        toast.error("Grant failed", { description: res.error });
      }
    });
  };

  const handleResolveReport = (status: "resolved" | "dismissed") => {
    if (!selectedReport) return;
    startTransition(async () => {
      const res = await resolveReportAction(
        selectedReport.id || selectedReport._id || "",
        status,
        resolutionNotes
      );
      if (res.success) {
        toast.success(`Report marked as ${status}.`);
        setSelectedReport(null);
        setResolutionNotes("");
        loadData();
      } else {
        toast.error("Action failed", { description: res.error });
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
              src="/images/pixel-coin.gif"
              alt="Admin"
              width={24}
              height={24}
              className="size-6 object-contain pixelated"
              unoptimized
            />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide font-mono uppercase">
              Admin & Moderation Portal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            System administration, player account moderation, economy management, and anti-cheat telemetry.
          </p>
        </div>

        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 font-mono text-xs flex items-center gap-1">
          <IconShieldLock className="size-3.5" />
          <span>RBAC ROOT</span>
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Button
          variant={activeTab === "overview" ? "default" : "ghost"}
          onClick={() => setActiveTab("overview")}
          className="text-xs font-mono h-8"
        >
          Overview KPIs
        </Button>
        <Button
          variant={activeTab === "users" ? "default" : "ghost"}
          onClick={() => setActiveTab("users")}
          className="text-xs font-mono h-8"
        >
          Players ({users.length})
        </Button>
        <Button
          variant={activeTab === "reports" ? "default" : "ghost"}
          onClick={() => setActiveTab("reports")}
          className="text-xs font-mono h-8"
        >
          Reports ({reports.length})
        </Button>
        <Button
          variant={activeTab === "logs" ? "default" : "ghost"}
          onClick={() => setActiveTab("logs")}
          className="text-xs font-mono h-8"
        >
          Audit & Anti-Cheat Logs
        </Button>
      </div>

      {/* TAB 1: OVERVIEW KPIS */}
      {activeTab === "overview" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-2 border-foreground dark:border-ring">
              <span className="text-[10px] text-muted-foreground font-mono uppercase block">TOTAL USERS</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black font-mono">{stats.users.total}</span>
                <span className="text-xs font-mono text-rose-400">{stats.users.banned} Banned</span>
              </div>
            </Card>

            <Card className="p-4 border-2 border-foreground dark:border-ring">
              <span className="text-[10px] text-muted-foreground font-mono uppercase block">ACTIVE CLANS</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black font-mono">{stats.guilds.total}</span>
                <span className="text-xs font-mono text-emerald-400">Guilds</span>
              </div>
            </Card>

            <Card className="p-4 border-2 border-foreground dark:border-ring">
              <span className="text-[10px] text-muted-foreground font-mono uppercase block">COINS IN CIRCULATION</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black font-mono text-amber-400">
                  🪙 {stats.economy.totalCoins.toLocaleString()}
                </span>
              </div>
            </Card>

            <Card className="p-4 border-2 border-foreground dark:border-ring">
              <span className="text-[10px] text-muted-foreground font-mono uppercase block">GEMS IN CIRCULATION</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black font-mono text-cyan-400">
                  💎 {stats.economy.totalGems.toLocaleString()}
                </span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search players by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchUsers()}
                className="w-full pl-9 pr-3 py-2 bg-background border-2 border-foreground dark:border-ring text-xs font-mono focus:outline-hidden"
              />
            </div>
            <Button variant="default" onClick={handleSearchUsers} className="font-mono text-xs">
              Search
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {users.map((u) => (
                  <div
                    key={u.id || u._id}
                    className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold">{u.name || u.displayName || u.email}</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono uppercase ${
                            u.role === "admin"
                              ? "border-purple-500/50 text-purple-400 bg-purple-500/10"
                              : u.role === "moderator"
                              ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/10"
                              : ""
                          }`}
                        >
                          {u.role}
                        </Badge>
                        {u.isBanned && (
                          <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/50 text-[10px] font-mono">
                            BANNED
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{u.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedGrantUser(u)}
                        className="text-[11px] font-mono h-7 flex items-center gap-1"
                      >
                        <IconCoins className="size-3.5 text-amber-400" />
                        <span>Grant Funds</span>
                      </Button>

                      {u.isBanned ? (
                        <Button
                          size="sm"
                          variant="default"
                          disabled={isPending}
                          onClick={() => handleUnbanUser(u.id || u._id || "")}
                          className="text-[11px] font-mono h-7"
                        >
                          Unban
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isPending || u.role === "admin"}
                          onClick={() => setSelectedBanUser(u)}
                          className="text-[11px] font-mono h-7"
                        >
                          Ban
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: MODERATION REPORTS */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="p-8 text-center bg-card border border-border text-muted-foreground font-mono text-xs">
              No moderation reports in queue. All clear!
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <Card key={rep.id || rep._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/50 font-mono text-[10px] uppercase">
                        {rep.reason}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">
                        Reported: <strong className="text-foreground">{rep.reportedUser?.name || rep.reportedUser?.email || rep.reportedUserId}</strong>
                      </span>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase">
                      {rep.status}
                    </Badge>
                  </div>

                  <p className="text-xs font-mono bg-muted/40 p-2.5 border border-border">
                    {rep.details}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Filed: {new Date(rep.createdAt).toLocaleString()}
                    </span>

                    {rep.status === "open" && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => setSelectedReport(rep)}
                        className="text-xs font-mono h-7"
                      >
                        Investigate & Resolve
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT & ANTI-CHEAT LOGS */}
      {activeTab === "logs" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold font-mono">Administrative & Anti-Cheat Telemetry</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {logs.map((log) => (
                <div key={log.id || log._id} className="p-3 sm:p-4 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono uppercase">
                        {log.action}
                      </Badge>
                      <span className="font-bold">{log.actorEmail || "system"}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Target: {log.targetId ? String(log.targetId) : "Global"} • {JSON.stringify(log.metadata || {})}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* BAN USER MODAL */}
      {selectedBanUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-2 border-foreground dark:border-ring">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-bold font-mono uppercase text-rose-400">
                Suspend Account
              </CardTitle>
              <CardDescription className="text-xs">
                Suspend access for {selectedBanUser.name || selectedBanUser.email}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground">Reason:</label>
                <input
                  type="text"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground">Duration (Days):</label>
                <input
                  type="number"
                  value={banDays}
                  onChange={(e) => setBanDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-border text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="ghost" className="flex-1 text-xs font-mono" onClick={() => setSelectedBanUser(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1 text-xs font-mono" onClick={handleBanUser}>
                  Confirm Suspension
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* GRANT CURRENCY MODAL */}
      {selectedGrantUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-2 border-foreground dark:border-ring">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-bold font-mono uppercase">
                Grant Player Funds
              </CardTitle>
              <CardDescription className="text-xs">
                Award Coins or Gems to {selectedGrantUser.name || selectedGrantUser.email}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground">Coins (🪙):</label>
                  <input
                    type="number"
                    value={grantCoins}
                    onChange={(e) => setGrantCoins(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-background border border-border text-xs font-mono focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground">Gems (💎):</label>
                  <input
                    type="number"
                    value={grantGems}
                    onChange={(e) => setGrantGems(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-background border border-border text-xs font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground">Reason / Note:</label>
                <input
                  type="text"
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="ghost" className="flex-1 text-xs font-mono" onClick={() => setSelectedGrantUser(null)}>
                  Cancel
                </Button>
                <Button variant="default" className="flex-1 text-xs font-mono bg-amber-500 text-black font-bold" onClick={handleGrantCurrency}>
                  Send Grant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* RESOLVE REPORT MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-2 border-foreground dark:border-ring">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-bold font-mono uppercase">
                Resolve Ticket
              </CardTitle>
              <CardDescription className="text-xs">
                Ticket: {selectedReport.reason.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground">Resolution Notes:</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Player was warned / Score reset..."
                  className="w-full px-3 py-2 bg-background border border-border text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="ghost" className="flex-1 text-xs font-mono" onClick={() => setSelectedReport(null)}>
                  Cancel
                </Button>
                <Button variant="secondary" className="flex-1 text-xs font-mono" onClick={() => handleResolveReport("dismissed")}>
                  Dismiss
                </Button>
                <Button variant="default" className="flex-1 text-xs font-mono bg-emerald-500 text-black font-bold" onClick={() => handleResolveReport("resolved")}>
                  Resolve
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
