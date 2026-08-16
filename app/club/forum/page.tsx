"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  getCategoriesAction,
  getThreadsAction,
  toggleVoteThreadAction,
  ForumCategory,
  ForumThread,
} from "@/app/actions/forum-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  IconMessage,
  IconPlus,
  IconSearch,
  IconFlame,
  IconClock,
  IconEye,
  IconArrowUp,
  IconArrowLeft,
  IconPin,
  IconLock,
} from "@tabler/icons-react";
import { toast } from "react-hot-toast";

export default function ForumPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sort, setSort] = useState<"latest" | "popular" | "views">("latest");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [catsRes, threadsRes] = await Promise.all([
        getCategoriesAction(),
        getThreadsAction({ category: selectedCategory, sort, search }),
      ]);
      if (catsRes.success && catsRes.categories) {
        setCategories(catsRes.categories);
      }
      if (threadsRes.success && threadsRes.data) {
        setThreads(threadsRes.data.threads || []);
      }
    } catch {
      toast.error("Failed to load forum discussions");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sort, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleVote = async (threadId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await toggleVoteThreadAction(threadId);
      if (res.success && res.upvotes !== undefined) {
        setThreads((prev) =>
          prev.map((t) =>
            t.id === threadId ? { ...t, upvoteCount: res.upvotes! } : t
          )
        );
        toast.success(res.hasVoted ? "Upvoted!" : "Upvote removed");
      } else {
        toast.error(res.error || "Failed to upvote thread");
      }
    } catch {
      toast.error("Please sign in to vote");
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link href="/club/main-menu">
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              <IconArrowLeft className="size-4" />
              <span>Menu</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <IconMessage className="size-6 sm:size-7 text-indigo-500 shrink-0" />
              <span>Community Forum</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Discuss games, strategies, tech setups, and platform updates.
            </p>
          </div>
        </div>
        <Link href="/club/forum/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <IconPlus className="size-4" />
            <span>New Thread</span>
          </Button>
        </Link>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        <Button
          variant={selectedCategory === "" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("")}
          className="rounded-full shrink-0 text-xs"
        >
          All Topics
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.slug ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.slug)}
            className="rounded-full gap-1.5 shrink-0 text-xs"
            style={
              selectedCategory === cat.slug
                ? { backgroundColor: cat.color, color: "#fff" }
                : undefined
            }
          >
            <span>{cat.name}</span>
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {cat.threadCount}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Controls Bar: Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1">
          <Button
            variant={sort === "latest" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSort("latest")}
            className="gap-1 text-xs px-2.5"
          >
            <IconClock className="size-3.5" />
            Latest
          </Button>
          <Button
            variant={sort === "popular" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSort("popular")}
            className="gap-1 text-xs px-2.5"
          >
            <IconFlame className="size-3.5" />
            Popular
          </Button>
          <Button
            variant={sort === "views" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSort("views")}
            className="gap-1 text-xs px-2.5"
          >
            <IconEye className="size-3.5" />
            Most Viewed
          </Button>
        </div>
      </div>

      {/* Threads List */}
      {loading ? (
        <div className="flex flex-col gap-4 py-8 text-center text-muted-foreground">
          <p className="animate-pulse">Loading discussions...</p>
        </div>
      ) : threads.length === 0 ? (
        <Card className="p-8 text-center border-dashed">
          <CardHeader>
            <CardTitle>No discussions found</CardTitle>
            <CardDescription>
              Be the first to start a conversation in this section!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/club/forum/new">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <IconPlus className="size-4" />
                Start a Thread
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {threads.map((thread) => (
            <Link key={thread.id} href={`/club/forum/thread/${thread.id}`}>
              <Card className="hover:border-indigo-500/50 transition-all duration-200 cursor-pointer group bg-card/60 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  {/* Upvote & Thread Info */}
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleVote(thread.id, e)}
                      className="flex flex-col items-center justify-center h-12 w-10 sm:h-14 sm:w-12 p-0 shrink-0 border-indigo-500/20 hover:border-indigo-500 group-hover:bg-indigo-500/10"
                    >
                      <IconArrowUp className="size-3.5 sm:size-4 text-indigo-400" />
                      <span className="text-[11px] sm:text-xs font-bold">{thread.upvoteCount}</span>
                    </Button>

                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        {thread.isPinned && (
                          <Badge variant="default" className="bg-amber-500 text-black gap-1 text-[10px]">
                            <IconPin className="size-3" /> Pinned
                          </Badge>
                        )}
                        {thread.isLocked && (
                          <Badge variant="destructive" className="gap-1 text-[10px]">
                            <IconLock className="size-3" /> Locked
                          </Badge>
                        )}
                        {thread.category && (
                          <Badge
                            variant="outline"
                            className="text-[10px] sm:text-xs font-semibold"
                            style={{ borderColor: thread.category.color, color: thread.category.color }}
                          >
                            {thread.category.name}
                          </Badge>
                        )}
                        {thread.tags?.map((tag) => (
                          <span key={tag} className="text-[10px] sm:text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-foreground group-hover:text-indigo-400 transition-colors break-words">
                        {thread.title}
                      </h2>

                      <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-muted-foreground flex-wrap">
                        <span>
                          By <strong className="text-foreground">{thread.author?.displayName || thread.author?.name || "Anonymous"}</strong>
                        </span>
                        <span>•</span>
                        <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Counters */}
                  <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-muted-foreground self-start sm:self-end md:self-center pl-13 sm:pl-0">
                    <div className="flex items-center gap-1 bg-secondary/50 px-2.5 py-1 rounded-full">
                      <IconMessage className="size-3.5 text-indigo-400" />
                      <span className="font-semibold text-foreground">{thread.commentCount}</span>
                      <span>replies</span>
                    </div>
                    <div className="flex items-center gap-1 bg-secondary/50 px-2.5 py-1 rounded-full">
                      <IconEye className="size-3.5 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{thread.views}</span>
                      <span>views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
