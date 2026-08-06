"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  getThreadByIdAction,
  getCommentsAction,
  createCommentAction,
  toggleVoteThreadAction,
  toggleVoteCommentAction,
  ForumThread,
  ForumComment,
} from "@/app/actions/forum-actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconArrowLeft,
  IconArrowUp,
  IconMessage,
  IconEye,
  IconSend,
  IconCornerDownRight,
} from "@tabler/icons-react";
import { toast } from "react-hot-toast";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ThreadDetailPage({ params }: PageProps) {
  const { id: threadId } = use(params);
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadThreadData() {
      setLoading(true);
      try {
        const [threadRes, commentsRes] = await Promise.all([
          getThreadByIdAction(threadId),
          getCommentsAction(threadId),
        ]);
        if (threadRes.success && threadRes.thread) {
          setThread(threadRes.thread);
        }
        if (commentsRes.success && commentsRes.comments) {
          setComments(commentsRes.comments);
        }
      } catch {
        toast.error("Failed to load thread details");
      } finally {
        setLoading(false);
      }
    }
    loadThreadData();
  }, [threadId]);

  const handleVoteThread = async () => {
    if (!thread) return;
    try {
      const res = await toggleVoteThreadAction(thread.id);
      if (res.success && res.upvotes !== undefined) {
        setThread((prev) => (prev ? { ...prev, upvoteCount: res.upvotes! } : null));
        toast.success(res.hasVoted ? "Upvoted!" : "Upvote removed");
      } else {
        toast.error(res.error || "Failed to vote");
      }
    } catch {
      toast.error("Please sign in to vote");
    }
  };

  const handleVoteComment = async (commentId: string) => {
    try {
      const res = await toggleVoteCommentAction(commentId);
      if (res.success && res.upvotes !== undefined) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, upvoteCount: res.upvotes! } : c))
        );
        toast.success(res.hasVoted ? "Upvoted!" : "Upvote removed");
      } else {
        toast.error(res.error || "Failed to vote comment");
      }
    } catch {
      toast.error("Please sign in to vote");
    }
  };

  const handleAddComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    const contentText = parentId ? replyContent : newComment;
    if (!contentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await createCommentAction(threadId, {
        content: contentText.trim(),
        parentCommentId: parentId,
      });

      if (res.success && res.comment) {
        setComments((prev) => [...prev, res.comment!]);
        if (parentId) {
          setReplyContent("");
          setReplyingTo(null);
        } else {
          setNewComment("");
        }
        setThread((prev) => (prev ? { ...prev, commentCount: prev.commentCount + 1 } : null));
        toast.success("Comment posted!");
      } else {
        toast.error(res.error || "Failed to post comment");
      }
    } catch {
      toast.error("Failed to post comment. Please sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 text-center text-muted-foreground animate-pulse">
        Loading discussion...
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen p-8 text-center">
        <h2 className="text-xl font-bold">Thread not found</h2>
        <Link href="/club/forum" className="mt-4 inline-block">
          <Button variant="outline">Back to Forum</Button>
        </Link>
      </div>
    );
  }

  const topLevelComments = comments.filter((c) => !c.parentComment);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentComment === parentId);

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <Link href="/club/forum">
          <Button variant="outline" size="sm" className="gap-2">
            <IconArrowLeft className="size-4" />
            <span>Back to Forum</span>
          </Button>
        </Link>
      </div>

      {/* Main Thread Card */}
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardHeader className="p-6 pb-3 flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {thread.category && (
              <Badge
                variant="outline"
                className="text-xs font-semibold"
                style={{ borderColor: thread.category.color, color: thread.category.color }}
              >
                {thread.category.name}
              </Badge>
            )}
            {thread.tags?.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{thread.title}</h1>

          <div className="flex items-center justify-between border-b border-border pb-4 pt-1">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarImage src={thread.author?.avatarUrl} />
                <AvatarFallback>
                  {(thread.author?.displayName || thread.author?.name || "A")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {thread.author?.displayName || thread.author?.name || "Anonymous"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Posted on {new Date(thread.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <IconEye className="size-4" /> {thread.views} views
              </span>
              <span className="flex items-center gap-1">
                <IconMessage className="size-4" /> {thread.commentCount} replies
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2 flex flex-col gap-6">
          <div className="prose prose-invert max-w-none text-foreground whitespace-pre-line leading-relaxed text-sm md:text-base">
            {thread.content}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoteThread}
              className="gap-2 border-indigo-500/30 hover:border-indigo-500"
            >
              <IconArrowUp className="size-4 text-indigo-400" />
              <span>Upvote</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {thread.upvoteCount}
              </Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Top-level Comment Box */}
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardContent className="p-5">
          <form onSubmit={(e) => handleAddComment(e)} className="flex flex-col gap-3">
            <Textarea
              placeholder="Join the discussion..."
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
              >
                <IconSend className="size-4" />
                <span>Post Comment</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <IconMessage className="size-5 text-indigo-400" />
          Replies ({comments.length})
        </h3>

        {topLevelComments.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center py-4">
            No replies yet. Be the first to comment!
          </p>
        ) : (
          topLevelComments.map((comment) => (
            <Card key={comment.id} className="bg-card/50 border-border">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7">
                      <AvatarImage src={comment.author?.avatarUrl} />
                      <AvatarFallback>
                        {(comment.author?.displayName || comment.author?.name || "A")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold">
                      {comment.author?.displayName || comment.author?.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVoteComment(comment.id)}
                    className="gap-1 text-xs h-7 px-2"
                  >
                    <IconArrowUp className="size-3.5 text-indigo-400" />
                    <span>{comment.upvoteCount}</span>
                  </Button>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line pl-9">
                  {comment.content}
                </p>

                <div className="pl-9 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs h-7 px-2 gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <IconCornerDownRight className="size-3" />
                    Reply
                  </Button>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <form onSubmit={(e) => handleAddComment(e, comment.id)} className="pl-9 mt-2 flex flex-col gap-2">
                    <Textarea
                      placeholder={`Replying to ${comment.author?.displayName || comment.author?.name || "user"}...`}
                      rows={2}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={submitting || !replyContent.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Reply
                      </Button>
                    </div>
                  </form>
                )}

                {/* Nested Replies */}
                {getReplies(comment.id).map((reply) => (
                  <div key={reply.id} className="pl-9 mt-3 pt-3 border-t border-border/50 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarImage src={reply.author?.avatarUrl} />
                          <AvatarFallback>
                            {(reply.author?.displayName || reply.author?.name || "A")[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold">
                          {reply.author?.displayName || reply.author?.name || "Anonymous"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVoteComment(reply.id)}
                        className="gap-1 text-xs h-6 px-1.5"
                      >
                        <IconArrowUp className="size-3 text-indigo-400" />
                        <span>{reply.upvoteCount}</span>
                      </Button>
                    </div>
                    <p className="text-xs text-foreground/90 whitespace-pre-line pl-8">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
