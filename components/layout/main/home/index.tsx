"use client";

import useGetPosts from "@/client/post/api/use-get-posts";
import useNewPost from "@/client/post/api/use-new-post";
import NewPostForm from "@/client/post/components/new-post-form";
import PostCard from "@/client/post/components/post-card";
import { useGetUserId } from "@/hooks/use-get-user-id";
import { useSession } from "@/hooks/use-session";

export default function HomeSection() {
  const userId = useGetUserId();
  const postsQuery = useGetPosts({ userId });

  const postMutation = useNewPost();

  const isPending = postMutation.isPending;
  const isLoading = postsQuery.isLoading;
  const isError = postsQuery.isError;

  if (isError) return <p>error</p>;
  if (isLoading) return <p>loading...</p>;

  return (
    <div className="p-4">
      {userId && <NewPostForm defaultValues={{ content: "", image: null }} disabled={isPending} onSubmit={(values) => postMutation.mutate({ ...values, userId })} />}
      <div className="space-y-3 my-5">
        {postsQuery.data?.map((post) => (
          <PostCard key={post.id} currentUserId={userId} post={post} isCurrentUserPost={post.userId === userId} />
        ))}
      </div>
    </div>
  );
}
