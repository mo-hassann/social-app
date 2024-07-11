import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import useToggleLike from "../api/use-toggle-like";
import { useSession } from "@/hooks/use-session";
import useGetLikeState from "../api/use-get-like-state";
import { useState } from "react";

type props = {
  postId: string;
  likeCount: number;
  curUserId?: string;
  isLiked: boolean;
};

export default function LikeBtn({ postId, likeCount, curUserId, isLiked }: props) {
  const toggleLikeMutation = useToggleLike();
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likeCountState, setLikeCountState] = useState(+likeCount);

  const onClick = () => {
    if (!curUserId) return;
    setIsLikedState((curState) => !curState);
    setLikeCountState((curState) => (isLikedState ? curState - 1 : curState + 1));
    toggleLikeMutation.mutate(
      { postId, userId: curUserId },
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
