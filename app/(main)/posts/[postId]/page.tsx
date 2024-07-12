"use client";

import useNewComment from "@/client/comment/api/use-new-comment";
import CommentsSection from "@/client/comment/components/comments-section";
import NewCommentForm from "@/client/comment/components/new-comment-form";
import useGetPost from "@/client/post/api/use-get-post";
import PostCard from "@/client/post/components/post-card";
import { useGetUserId } from "@/hooks/use-get-user-id";

type props = { params: { postId: string } };

export default function PostPage({ params: { postId } }: props) {
  const userId = useGetUserId();
  const postQuery = useGetPost({ postId, userId });
  const newCommentMutation = useNewComment();

  const isPending = newCommentMutation.isPending;

  if (postQuery.isError) return <div>error</div>;
  if (postQuery.isPending) return <div>pending</div>;
  if (postQuery.isLoading) return <div>loading...</div>;

  return (
    <div className="flex flex-col p-3">
      <PostCard post={postQuery.data} isCurrentUserPost={postQuery.data.userId === userId} currentUserId={userId} />
      <div>
        <CommentsSection postId={postId} userId={userId} />
        {userId && <NewCommentForm defaultValues={{ content: "" }} disabled={isPending} onSubmit={(values) => newCommentMutation.mutate({ ...values, userId, postId })} />}
      </div>
    </div>
  );
  return <div>PostPage: {JSON.stringify(postQuery.data)}</div>;
}
