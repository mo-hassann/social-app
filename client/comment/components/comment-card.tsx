import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot, EllipsisVertical, MessageCircleHeart, ThumbsUp } from "lucide-react";
import LikeBtn from "@/client/like/components/like-btn";
import CommentLikeBtn from "@/client/like/components/comment-like-btn";

type props = {
  currentUserId?: string;
  isCurrentUserComment: boolean;
  comment: {
    id: string;
    content: string;
    createdAt: string | null;
    userId: string;
    user: string;
    username: string;
    isLiked: boolean;
    userImage: string | null;
    likeCount: number;
  };
};

export default function CommentCard({ comment, currentUserId, isCurrentUserComment }: props) {
  return (
    <Card className="ml-7 mt-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={comment.userImage || undefined} alt={comment.username} />
              <AvatarFallback>{comment.user.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col leading-4">
              <p className="capitalize">{comment.user}</p>
              <Button className="p-0 m-0 h-auto" variant="link" asChild>
                <Link href={`/user/${comment.userId}`}>@{comment.username}</Link>
              </Button>
            </div>
            <p className="text-muted-foreground text-xs flex items-center">
              <Dot />
              {formatDistance(new Date(comment.createdAt as string), new Date())}
            </p>
          </div>
          {isCurrentUserComment && (
            <Button size="icon" variant="ghost">
              <EllipsisVertical size={12} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <h5>{comment.content}</h5>
      </CardContent>
      <CardFooter className="flex items-center">
        <div className="flex items-center gap-3">
          <CommentLikeBtn curUserId={currentUserId} isLiked={comment.isLiked} likeCount={comment.likeCount} commentId={comment.id} />
        </div>
      </CardFooter>
    </Card>
  );
}
