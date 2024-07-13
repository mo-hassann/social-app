"use client";

import useGetUserPosts from "@/client/post/api/use-get-user-posts";
import PostsContainer from "@/client/post/components/posts-container";
import useGetUser from "@/client/user/api/use-get-user";
import UserInfoHeader from "@/client/user/components/user-info-header";
import { useGetUserId } from "@/hooks/use-get-user-id";

type props = { params: { userId: string } };

export default function UserPage({ params: { userId } }: props) {
  const curUserId = useGetUserId();
  const userQuery = useGetUser({ userId });
  const userPostsQuery = useGetUserPosts({ userId });

  const isError = userPostsQuery.isError || userQuery.isError;
  const isLoading = userQuery.isLoading;
  const isPending = userQuery.isPending;

  if (isError) return <div>error</div>;
  if (isLoading) return <div>loading...</div>;
  if (isPending) return <div>pending</div>;

  const user = userQuery.data;

  return (
    <div className="p-3 h-full overflow-y-auto pb-16">
      <UserInfoHeader user={{ ...user, backgroundImage: null }} curUserId={curUserId} />
      {!userPostsQuery.isLoading && !userPostsQuery.isPending && <PostsContainer posts={userPostsQuery.data} curUserId={curUserId} />}
    </div>
  );
}
