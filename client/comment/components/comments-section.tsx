import useGetComments from "../api/use-get-comments";
import CommentCard from "./comment-card";

type props = {
  userId?: string;
  postId: string;
};

export default function CommentsSection({ postId, userId }: props) {
  const commentsQuery = useGetComments({ postId, userId });
  const comments = commentsQuery.data;
  if (commentsQuery.isError) return <div>error</div>;
  if (commentsQuery.isLoading) return <div>loading...</div>;
  if (!comments) return <div>no comments</div>;
  return (
    <>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={{ ...comment }} curUserId={userId} />
      ))}
    </>
  );
}
