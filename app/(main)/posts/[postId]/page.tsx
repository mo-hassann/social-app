"use client";

import useNewComment from "@/client/comment/api/use-new-comment";
import CommentsSection from "@/client/comment/components/comments-section";
import NewCommentForm from "@/client/comment/components/new-comment-form";
import ReplayCommentBar from "@/client/comment/components/replay-comment-bar";
import useReplayComment from "@/client/comment/hooks/use-comment-replay";
import useGetPost from "@/client/post/api/use-get-post";
import PostCard from "@/client/post/components/post-card";
import ErrorCard from "@/components/error-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserId } from "@/hooks/use-get-user-id";
import { useSession } from "@/hooks/use-session";

type props = { params: { postId: string } };

export default function PostPage({ params: { postId } }: props) {
  const { session } = useSession();
  const postQuery = useGetPost(postId);

  const isError = postQuery.isError;
  const isLoading = postQuery.isLoading || postQuery.isPending || !session || !session.user;

  if (isError) return <ErrorCard />;
  if (isLoading) return <PostSkeleton />;

  return (
    <div className="flex flex-col p-3 h-full">
      {postQuery.data && <PostCard post={postQuery.data} curUserId={session.user.id} />}

      <CommentsSection postId={postId} curUser={session.user} />
    </div>
  );
}

const PostSkeleton = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-3 w-full">
      <Skeleton className="size-20 rounded-full flex-shrink-0" />
      <div className="w-full space-y-2">
        <Skeleton className="w-7/12 h-6 rounded-md" />
        <Skeleton className="w-24 h-6 rounded-md" />
      </div>
    </div>
    <Skeleton className="w-full h-52 rounded-md" />
  </div>
);
