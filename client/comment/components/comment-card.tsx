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
  const [isHide, setIsHide] = useState<boolean>(comment.level === 1 ? false : true); // keep the parent comment without hide
  const setReplayComment = useReplayComment((state) => state.setReplayComment);

  const onReplay = () => {
    setReplayComment({ content: comment.content, id: comment.id });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {comment.children && comment.children.length > 0 && (
          <Button variant="ghost" size="icon" onClick={() => setIsHide((curState) => !curState)}>
            {isHide ? <ArrowDown /> : <ArrowUp />}
          </Button>
        )}

        <Card className={"mt-3"} style={{ marginLeft: 20 * (comment.level || 1) }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={comment.userImage || undefined} alt={comment.username} />
                  <AvatarFallback>{comment.user?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col leading-4">
                  <p className="capitalize">{comment.user}</p>
                  <Button className="p-0 m-0 h-auto" variant="link" asChild>
                    <Link href={`/users/${comment.userId}`}>@{comment.username}</Link>
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs flex items-center">
                  <Dot />
                  {formatDistance(new Date(comment.createdAt as string), new Date())}
                </p>
              </div>
              {comment.userId === curUserId && <CommentActions commentId={comment.id} />}
            </div>
          </CardHeader>
          <CardContent>
            <h5>{comment.content}</h5>
          </CardContent>
          <CardFooter className="flex items-center">
            <div className="flex items-center gap-3">
              <CommentLikeBtn isLiked={comment.isLiked} likeCount={comment.likeCount} commentId={comment.id} />
              <Button size="sm" variant="outline" onClick={onReplay}>
                replay <ReplyAll className="ml-2" size={16} />
              </Button>
            </div>
          </CardFooter>
        </Card>
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
