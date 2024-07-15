"use client";

import useGetPosts from "@/client/post/api/use-get-posts";
import useNewPost from "@/client/post/api/use-new-post";
import NewPostForm from "@/client/post/components/new-post-form";
import PostsContainer from "@/client/post/components/posts-container";
import Spinner from "@/components/spinner";
import { useGetUserId } from "@/hooks/use-get-user-id";

export default function HomePage() {
  const curUserId = useGetUserId();
  const postsQuery = useGetPosts();
  const postMutation = useNewPost();

  const isError = postsQuery.isError || postMutation.isError;
  const isLoading = postsQuery.isLoading || postsQuery.isPending;
  const isPending = postMutation.isPending;

  if (isError) return <div>error</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="p-4 h-full overflow-y-scroll pb-16">
      {curUserId && <NewPostForm defaultValues={{ content: "", image: null }} disabled={isPending} onSubmit={(values) => postMutation.mutate({ ...values })} />}
      {isPending && <Spinner />}
      <PostsContainer posts={postsQuery.data} curUserId={curUserId} />
    </div>
  );
}
