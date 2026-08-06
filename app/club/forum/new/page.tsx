"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCategoriesAction,
  createThreadAction,
  suggestTopicAction,
  ForumCategory,
} from "@/app/actions/forum-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconArrowLeft, IconSend, IconSparkles } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

export default function CreateThreadPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await getCategoriesAction();
        if (res.success && res.categories && res.categories.length > 0) {
          setCategories(res.categories);
          setCategoryId(res.categories[0].id || res.categories[0].slug);
        }
      } catch {
        toast.error("Failed to load categories");
      }
    }
    loadCats();
  }, []);

  const handleSuggestAI = async () => {
    setGeneratingAI(true);
    try {
      const res = await suggestTopicAction(title || undefined);
      if (res.success && res.suggestion) {
        const { title: aiTitle, categorySlug, tags, content: aiContent } = res.suggestion;
        setTitle(aiTitle);
        setContent(aiContent);
        if (tags) setTagsInput(tags.join(", "));

        const matchedCat = categories.find((c) => c.slug === categorySlug);
        if (matchedCat) {
          setCategoryId(matchedCat.id || matchedCat.slug);
        }

        toast.success("AI generated thread topic & content!");
      } else {
        toast.error(res.error || "Failed to generate topic suggestion");
      }
    } catch {
      toast.error("AI topic generator unavailable");
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const res = await createThreadAction({
        title: title.trim(),
        content: content.trim(),
        categoryId,
        tags,
      });

      if (res.success && res.thread) {
        toast.success("Thread created successfully!");
        router.push(`/club/forum/thread/${res.thread.id}`);
      } else {
        toast.error(res.error || "Failed to create thread");
      }
    } catch {
      toast.error("Failed to create thread. Please ensure you are logged in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/club/forum">
            <Button variant="outline" size="sm" className="gap-2">
              <IconArrowLeft className="size-4" />
              <span>Back to Forum</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight">Create New Thread</h1>
        </div>

        {/* AI Spark Topic Button */}
        <Button
          type="button"
          onClick={handleSuggestAI}
          disabled={generatingAI}
          variant="secondary"
          size="sm"
          className="gap-2 border border-purple-500/30 hover:border-purple-500 text-purple-300"
        >
          <IconSparkles className="size-4 text-purple-400 animate-pulse" />
          <span>{generatingAI ? "AI Generating..." : "Suggest Topic with AI"}</span>
        </Button>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle>Start a Discussion</CardTitle>
          <CardDescription>
            Share your thoughts, ask questions, or use AI to draft an engaging post.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Title *</label>
              <Input
                placeholder="e.g., Best strategies for beating Level 10 Boss"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={150}
                required
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Category *</label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id || cat.slug} value={cat.id || cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Tags (comma separated)</label>
              <Input
                placeholder="e.g., strategy, guide, highscore"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Content *</label>
              <Textarea
                placeholder="Write your post content here..."
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link href="/club/forum">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
              >
                <IconSend className="size-4" />
                <span>{submitting ? "Publishing..." : "Publish Thread"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
