import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import useToggleCommentLike from "../api/use-toggle-comment-like";

type props = {
  commentId: string;
  likeCount: number;
  curUserId?: string;
  isLiked: boolean;
};

export default function CommentLikeBtn({ commentId, likeCount, curUserId, isLiked }: props) {
  const toggleLikeMutation = useToggleCommentLike();
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likeCountState, setLikeCountState] = useState(+likeCount);

  const onClick = () => {
    if (!curUserId) return;
    setIsLikedState((curState) => !curState);
    setLikeCountState((curState) => (isLikedState ? curState - 1 : curState + 1));
    toggleLikeMutation.mutate(
      { commentId, userId: curUserId },
      {
        onError: () => {
          setIsLikedState((curState) => !curState);
          setLikeCountState((curState) => (isLikedState ? curState + 1 : curState - 1));
        },
      }
    );
  };

  return (
    <Button size="sm" variant={isLikedState ? "default" : "outline"} onClick={onClick}>
      {likeCountState} <ThumbsUp className="ml-2" size={16} />
    </Button>
  );
}
