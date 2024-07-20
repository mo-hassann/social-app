import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import useToggleCommentLike from "../api/use-toggle-comment-like";
import { cn } from "@/lib/utils";

type props = {
  commentId: string;
  likeCount: number;
  isLiked: boolean;
  className?: string;
};

export default function CommentLikeBtn({ commentId, likeCount, isLiked, className }: props) {
  const toggleLikeMutation = useToggleCommentLike();
  const [optimisticLike, setOptimisticLike] = useState({ isLiked, likeCount: Number(likeCount) });

  const isPending = toggleLikeMutation.isPending;

  const onClick = () => {
    setOptimisticLike((curState) => ({ isLiked: !curState.isLiked, likeCount: curState.isLiked ? curState.likeCount - 1 : curState.likeCount + 1 }));

    toggleLikeMutation.mutate(
      { id: commentId },
      {
        onError: () => {
          setOptimisticLike((curState) => ({ isLiked: !curState, likeCount: curState.isLiked ? curState.likeCount - 1 : curState.likeCount + 1 }));
        },
      }
    );
  };

  return (
    <Button className={cn(className)} disabled={isPending} size="sm" variant={optimisticLike.isLiked ? "default" : "outline"} onClick={onClick}>
      {optimisticLike.likeCount} <ThumbsUp className="ml-1" size={12} />
    </Button>
  );
}
