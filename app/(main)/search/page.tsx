"use client";

import useGetSearchPosts from "@/client/post/api/use-get-search-posts";
import PostsContainer from "@/client/post/components/posts-container";
import ErrorCard from "@/components/error-card";
import NoDataCard from "@/components/no-data-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { session, status } = useSession();
  const postsQuery = useGetSearchPosts(searchQuery);

  const isError = postsQuery.isError || status === "error";
  const isLoading = postsQuery.isLoading || postsQuery.isPending || status === "pending" || !session || !session?.user;

  if (isError) return <ErrorCard />;
  if (isLoading) return <SearchPageSkeleton />;
  if (postsQuery.data.length === 0) return <NoDataCard />;

  return (
    <div className="px-4 h-full overflow-y-scroll">
      <h1 className="text-2xl">search &quot;{searchQuery}...&quot;</h1>
      <PostsContainer posts={postsQuery.data} curUserId={session?.user?.id} />
    </div>
  );
}

const SearchPageSkeleton = () => (
  <div className="w-full space-y-3">
    <div className="flex items-center gap-2 w-full">
      <Skeleton className="size-16 rounded-full shrink-0" />
      <div className="w-full space-y-2">
        <Skeleton className="w-3/12 h-7 rounded-md" />
        <Skeleton className="w-7/12 h-7 rounded-md" />
      </div>
    </div>
    <Skeleton className="w-full h-56 rounded-md" />
    <Skeleton className="w-full h-72 rounded-md" />
  </div>
);
