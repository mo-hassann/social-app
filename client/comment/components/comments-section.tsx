import React from "react";
import useGetComments from "../api/use-get-comments";
import CommentCard from "./comment-card";

type props = {
  userId?: string;
  postId: string;
};

export default function CommentsSection({ postId, userId }: props) {
  const commentsQuery = useGetComments({ postId, userId });
  if (commentsQuery.isError) return <div>error</div>;
  if (commentsQuery.isLoading) return <div>loading...</div>;
  return (
    <div>
      {commentsQuery.data?.map((comment) => (
        <CommentCard key={comment.id} comment={{ ...comment }} isCurrentUserComment={comment.userId === userId} currentUserId={userId} />
      ))}
    </div>
  );
}
