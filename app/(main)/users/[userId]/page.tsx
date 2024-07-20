"use client";

import useGetUserPosts from "@/client/post/api/use-get-user-posts";
import PostsContainer from "@/client/post/components/posts-container";
import useGetUser from "@/client/user/api/use-get-user";
import UserInfoHeader from "@/client/user/components/user-info-header";
import ErrorCard from "@/components/error-card";
import NotFoundCard from "@/components/not-found-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserId } from "@/hooks/use-get-user-id";

type props = { params: { userId: string } };

export default function UserPage({ params: { userId } }: props) {
  const curUserId = useGetUserId();
  const userQuery = useGetUser({ userId });
  const userPostsQuery = useGetUserPosts({ userId });

  const isError = userQuery.isError || userPostsQuery.isError;
  const isLoading = userQuery.isLoading || userQuery.isPending || userPostsQuery.isLoading || userPostsQuery.isPending || !curUserId;

  if (isError) return <ErrorCard />;
  if (isLoading) return <UserInfoHeaderSkeleton />;
  if (!userQuery.data) return <NotFoundCard />;

  return (
    <div className="p-3 h-full overflow-y-auto pb-16">
      <UserInfoHeader user={{ ...userQuery.data, backgroundImage: null }} curUserId={curUserId} />

      <PostsContainer posts={userPostsQuery.data} curUserId={curUserId} />
    </div>
  );
}

const UserInfoHeaderSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="w-full h-52 rounded-md" />
    <div className="flex items-center gap-3 w-full">
      <Skeleton className="size-24 rounded-full flex-shrink-0" />
      <div className="w-full space-y-2">
        <Skeleton className="w-7/12 h-8 rounded-md" />
        <Skeleton className="w-24 h-8 rounded-md" />
      </div>
    </div>
  </div>
);
