import { Button } from "@/components/ui/button";
import useFollowUser from "../api/use-follow-user";
import { useState } from "react";

type props = { userId: string; isFollowed: boolean };
export default function FollowBtn({ userId, isFollowed }: props) {
  const followUserMutation = useFollowUser();
  const [optimisticFollow, setOptimisticFollow] = useState({ isFollowed });

  const isPending = followUserMutation.isPending;

  const onClick = () => {
    setOptimisticFollow((curState) => ({ isFollowed: !curState.isFollowed }));

    followUserMutation.mutate(
      { id: userId },
      {
        onError: () => {
          setOptimisticFollow((curState) => ({ isFollowed: !curState.isFollowed }));
        },
      }
    );
  };

  return (
    <Button disabled={isPending} variant={optimisticFollow.isFollowed ? "secondary" : "default"} onClick={onClick}>
      {optimisticFollow.isFollowed ? "un follow" : "follow"}
    </Button>
  );
}
