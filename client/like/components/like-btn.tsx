import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import useToggleLike from "../api/use-toggle-post-like";
import { useState } from "react";

type props = {
  postId: string;
  likeCount: number;
  isLiked: boolean;
};

export default function LikeBtn({ postId, likeCount, isLiked }: props) {
  const toggleLikeMutation = useToggleLike();
  const [optimisticLike, setOptimisticLike] = useState({ isLiked, likeCount: Number(likeCount) });

  const isPending = toggleLikeMutation.isPending;

  const onClick = () => {
    setOptimisticLike((curState) => ({ isLiked: !curState.isLiked, likeCount: curState.isLiked ? curState.likeCount - 1 : curState.likeCount + 1 }));

    toggleLikeMutation.mutate(
      { id: postId },
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
