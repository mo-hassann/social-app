import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";

import { Dot, EllipsisVertical, MessageCircleHeart, ThumbsUp } from "lucide-react";
import LikeBtn from "@/client/like/components/like-btn";
import UserAvatar from "@/components/user-avatar";

type props = {
  curUserId?: string;
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

export default function PostCard({ post, curUserId }: props) {
  // function to mark the tags
  const renderContentWithTags = (text: string) => {
    const regex = /#(\w+)/g;
    // debugger;
    return text.split(regex).map((part, index) =>
      index % 2 === 1 ? (
        <Link className="text-blue-500 hover:underline" href={`?tag=${part}`} key={index}>
          #{part}
        </Link>
      ) : (
        part
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar fallbackText={post.username} image={post.userImage || undefined} />

            <div className="flex flex-col leading-4">
              <p className="capitalize">{post.user}</p>
              <Button className="p-0 m-0 h-auto" variant="link" asChild>
                <Link href={`/users/${post.userId}`}>@{post.username}</Link>
              </Button>
            </div>
            <p className="text-muted-foreground text-xs flex items-center">
              <Dot />
              {formatDistance(new Date(post.createdAt), new Date())}
            </p>
          </div>
          {curUserId === post.userId && (
            <Button size="icon" variant="ghost">
              <EllipsisVertical size={12} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <h3>{renderContentWithTags(post.content)}</h3>
        {post.image && <Image src={post.image} alt={post.content} width={200} height={200} />}
      </CardContent>
      <CardFooter className="flex items-center">
        <div className="flex items-center gap-3">
          <LikeBtn curUserId={curUserId} isLiked={post.isLiked} likeCount={post.likeCount} postId={post.id} />
          <Button asChild size="sm" variant="outline">
            <Link href={`/posts/${post.id}`}>
              {post.commentCount} <MessageCircleHeart className="ml-2" size={16} />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
