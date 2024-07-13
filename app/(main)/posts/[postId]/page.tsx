"use client";

import useNewComment from "@/client/comment/api/use-new-comment";
import CommentsSection from "@/client/comment/components/comments-section";
import NewCommentForm from "@/client/comment/components/new-comment-form";
import ReplayCommentBar from "@/client/comment/components/replay-comment-bar";
import useReplayComment from "@/client/comment/hooks/use-comment-replay";
import useGetPost from "@/client/post/api/use-get-post";
import PostCard from "@/client/post/components/post-card";
import { useGetUserId } from "@/hooks/use-get-user-id";
import { ReplyAll, X } from "lucide-react";
import { useState } from "react";

type props = { params: { postId: string } };

export default function PostPage({ params: { postId } }: props) {
  const userId = useGetUserId();
  const postQuery = useGetPost({ postId, userId });
  const newCommentMutation = useNewComment();
  const replayComment = useReplayComment((state) => state.comment);

  const isPending = newCommentMutation.isPending;

  if (postQuery.isError) return <div>error</div>;
  if (postQuery.isPending) return <div>pending</div>;
  if (postQuery.isLoading) return <div>loading...</div>;

  return (
    <div className="flex flex-col p-3 overflow-auto h-full">
      <PostCard post={postQuery.data} isCurrentUserPost={postQuery.data.userId === userId} curUserId={userId} />

      <div className="mb-52">
        <CommentsSection postId={postId} userId={userId} />
      </div>

      {userId && (
        <div className="absolute bottom-12 pb-4 left-0 bg-secondary w-full rounded-t-lg ">
          <ReplayCommentBar />
          <NewCommentForm className="p-3" defaultValues={{ content: "" }} disabled={isPending} onSubmit={(values) => newCommentMutation.mutate({ ...values, userId, postId, parentCommentId: replayComment && replayComment.id })} />
        </div>
      )}
    </div>
  );
}
