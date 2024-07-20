import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowDown, ArrowUp, Dot, EllipsisVertical, MessageCircleHeart, ReplyAll, ThumbsUp } from "lucide-react";
import LikeBtn from "@/client/like/components/like-btn";
import CommentLikeBtn from "@/client/like/components/comment-like-btn";
import { useState } from "react";
import useCommentReplay from "../hooks/use-comment-replay";
import useReplayComment from "../hooks/use-comment-replay";
import CommentActions from "./comment-actions";

type commentT = {
  id: string;
  content: string;
  createdAt: string | null;
  userId: string;
  user: string;
  username: string;
  isLiked: boolean;
  userImage: string | null;
  likeCount: number;
  level?: number;
  parentCommentId: string | null;
  children?: commentT[];
};

type props = {
  curUserId?: string;
  comment: commentT;
};

export default function CommentCard({ comment, curUserId }: props) {
  const [isHide, setIsHide] = useState<boolean>(false);
  const setReplayComment = useReplayComment((state) => state.setReplayComment);

  const onReplay = () => {
    setReplayComment({ content: comment.content, id: comment.id });
  };

  return (
    <>
      <div className="flex items-center gap-2" style={{ marginLeft: 50 * ((comment.level ?? 0) - 1) }}>
        <div className="flex flex-col gap-1 justify-start items-center h-full">
          <Avatar>
            <AvatarImage src={comment.userImage || undefined} alt={comment.username} />
            <AvatarFallback>{comment.user?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {comment.children && comment.children.length > 0 && (
            <Button className="rounded-full size-8" variant="ghost" size="icon" onClick={() => setIsHide((curState) => !curState)}>
              {isHide ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
            </Button>
          )}
        </div>

        <div className="bg-card/60 rounded-md w-full py-1.5 px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-4">
                <p className="capitalize text-muted-foreground">{comment.user}</p>
                <Button size="sm" className="p-0 m-0 h-auto text-xs" variant="link" asChild>
                  <Link href={`/users/${comment.userId}`}>@{comment.username}</Link>
                </Button>
              </div>
              <p className="text-muted-foreground text-[.6rem] flex items-center">
                <Dot />
                {comment.createdAt && formatDistance(new Date(comment.createdAt as string), new Date())}
              </p>
            </div>
            {comment.userId === curUserId && <CommentActions commentId={comment.id} />}
          </div>

          <p className="my-2">{comment.content}</p>

          <div className="flex items-center gap-3 text-muted-foreground">
            <CommentLikeBtn className="p-1.5 text-xs w-12 h-7" isLiked={comment.isLiked} likeCount={comment.likeCount} commentId={comment.id} />
            <Button className="p-1.5 text-xs h-7" size="sm" variant="outline" onClick={onReplay}>
              replay <ReplyAll className="ml-1" size={12} />
            </Button>
          </div>
        </div>
      </div>
      {!isHide && (
        <>
          {comment.children?.map((childComment) => (
            <CommentCard key={childComment.id} comment={{ ...childComment }} curUserId={curUserId} />
          ))}
        </>
      )}
    </>
  );
}
