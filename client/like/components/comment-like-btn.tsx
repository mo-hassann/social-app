import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import useToggleCommentLike from "../api/use-toggle-comment-like";

type props = {
  commentId: string;
  likeCount: number;
  isLiked: boolean;
};

export default function CommentLikeBtn({ commentId, likeCount, isLiked }: props) {
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
    <Button disabled={isPending} size="sm" variant={optimisticLike.isLiked ? "default" : "outline"} onClick={onClick}>
      {optimisticLike.likeCount} <ThumbsUp className="ml-2" size={16} />
    </Button>
  );
}
