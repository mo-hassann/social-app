"use client";

import useGetPosts from "@/client/post/api/use-get-posts";
import useNewPost from "@/client/post/api/use-new-post";
import NewPostForm from "@/client/post/components/new-post-form";
import PostsContainer from "@/client/post/components/posts-container";
import ErrorCard from "@/components/error-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";

export default function HomePage() {
  const { session, status } = useSession();
  const postsQuery = useGetPosts();
  const postMutation = useNewPost();

  const isError = postsQuery.isError || status === "error";
  const isLoading = postsQuery.isLoading || postsQuery.isPending || status === "pending" || !session || !session.user;
  const isPending = postMutation.isPending;

  if (isError) return <ErrorCard />;
  if (isLoading) return <HomePageSkeleton />;

  return (
    <div className="p-4 h-full overflow-y-scroll pb-16">
      <NewPostForm curUser={{ name: session.user.name as string | undefined, image: session.user.image as string | undefined }} defaultValues={{ content: "", image: null }} isPending={isPending} onSubmit={(values) => postMutation.mutate({ ...values })} />
      <PostsContainer posts={postsQuery.data} curUserId={session?.user?.id} />
    </div>
  );
}

const HomePageSkeleton = () => (
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
