import ErrorCard from "@/components/error-card";
import useGetComments from "../api/use-get-comments";
import CommentCard from "./comment-card";
import NoDataCard from "@/components/no-data-card";
import { Skeleton } from "@/components/ui/skeleton";
import ReplayCommentBar from "./replay-comment-bar";
import NewCommentForm from "./new-comment-form";
import type { AdapterUser } from "@auth/core/adapters";
import useNewComment from "../api/use-new-comment";
import useReplayComment from "../hooks/use-comment-replay";

type props = {
  postId: string;
  curUser?: AdapterUser;
};

export default function CommentsSection({ postId, curUser }: props) {
  const commentsQuery = useGetComments({ postId });

  const newCommentMutation = useNewComment();
  const replayComment = useReplayComment((state) => state.comment);

  const isError = commentsQuery.isError;
  const isLoading = commentsQuery.isLoading || commentsQuery.isPending || !curUser;
  const isPending = newCommentMutation.isPending;

  if (isError) return <ErrorCard />;
  if (isLoading) return <CommentSkeleton />;

  return (
    <>
      <div className="flex flex-col gap-1.5 my-2 text-xs h-full overflow-y-auto">
        {commentsQuery.data.map((comment) => (
          <CommentCard key={comment.id} comment={{ ...comment }} curUserId={curUser.id} />
        ))}
        {commentsQuery.data.length === 0 && <NoDataCard />}
      </div>

      <div className="w-full overflow-hidden shrink-0">
        <ReplayCommentBar />
        <NewCommentForm curUser={curUser} className="p-1.5" defaultValues={{ content: "" }} disabled={isPending} onSubmit={(values) => newCommentMutation.mutate({ ...values, postId, parentCommentId: replayComment && replayComment.id })} />
      </div>
    </>
  );
}

const CommentSkeleton = () => (
  <div className="space-y-2 h-full my-3">
    <Skeleton className="w-7/12 h-12 rounded-md" />
    <Skeleton className="w-full h-40 rounded-md" />
    <Skeleton className="w-full h-40 rounded-md" />
  </div>
);
