import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot, EllipsisVertical, MessageCircleHeart, ThumbsUp } from "lucide-react";
import LikeBtn from "@/client/like/components/like-btn";

type props = {
  currentUserId?: string;
  isCurrentUserPost: boolean;
  post: {
    id: string;
    content: string;
    image: string | null;
    createdAt: string;
    userId: string;
    isLiked: boolean;
    user: string;
    username: string;
    userImage: string | null;
    commentCount: number;
    likeCount: number;
    tags: {
      id?: string;
      name: string;
    }[];
  };
};

export default function PostCard({ post, currentUserId, isCurrentUserPost }: props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.userImage || undefined} alt={post.username} />
              <AvatarFallback>{post.user.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col leading-4">
              <p className="capitalize">{post.user}</p>
              <Button className="p-0 m-0 h-auto" variant="link" asChild>
                <Link href={`/user/${post.userId}`}>@{post.username}</Link>
              </Button>
            </div>
            <p className="text-muted-foreground text-xs flex items-center">
              <Dot />
              {formatDistance(new Date(post.createdAt), new Date())}
            </p>
          </div>
          {isCurrentUserPost && (
            <Button size="icon" variant="ghost">
              <EllipsisVertical size={12} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <h3>{post.content}</h3>
        {post.image && <Image src={post.image} alt={post.content} width={200} height={200} />}
      </CardContent>
      <CardFooter className="flex items-center">
        <div className="flex items-center gap-3">
          <LikeBtn curUserId={currentUserId} isLiked={post.isLiked} likeCount={post.likeCount} postId={post.id} />
          <Button size="sm" variant="outline">
            {post.commentCount} <MessageCircleHeart className="ml-2" size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
