"use client";
import Link from "next/link";
import useGetTrendingTags from "../api/use-get-trending-tags";
import { Skeleton } from "@/components/ui/skeleton";

export default function HashtagsMainCard() {
  const trendingTagsQuery = useGetTrendingTags();

  const isLoading = trendingTagsQuery.isLoading || trendingTagsQuery.isPending;
  const isError = trendingTagsQuery.isError;

  if (isError) return;
  if (isLoading) return <HashtagsSkeleton />;
  if (trendingTagsQuery.data.length === 0) return;

  return (
    <div className="space-y-3">
      <h2 className="text-xl">Trending Hashtags</h2>
      <div className="flex gap-4 flex-wrap">
        {trendingTagsQuery.data.map((tag) => (
          <Link key={tag.name} href={`/search?q=${tag.name}`} className="rounded-full bg-card text-muted-foreground px-3 py-1.5 hover:bg-muted hover:text-white cursor-pointer">
            #{tag.name} <span>({tag.tagCount})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const HashtagsSkeleton = () => (
  <div className="flex gap-3 flex-wrap w-[320px] mx-auto">
    <Skeleton className="w-36 h-10 rounded-md" />
    <Skeleton className="w-28 h-10 rounded-md" />
    <Skeleton className="w-16 h-10 rounded-md" />
    <Skeleton className="w-20 h-10 rounded-md" />
  </div>
);
