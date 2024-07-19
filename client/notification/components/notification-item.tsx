import { Button } from "@/components/ui/button";
import { notificationSelectSchema } from "@/db/schemas/notification";
import { useRouter } from "next/navigation";

type props = {
  notification: {
    id: string;
    userName: string | null;
    userId: string;
    notificationName: "NEW_POST" | "NEW_COMMENT" | "NEW_POST_LIKE" | "NEW_COMMENT_LIKE" | "NEW_FOLLOWER";
    postId: string | null;
    commentId: string | null;
    postLikeId: string | null;
    commentLikeId: string | null;
  };
};

export default function NotificationItem({ notification }: props) {
  const router = useRouter();
  switch (notification.notificationName) {
    case "NEW_POST":
      return (
        <Button className="w-full h-20 bg-muted/30" variant="ghost" onClick={() => router.push(`/posts/${notification.postId}`)}>
          The user
          <Button variant="link" onClick={() => router.push(`/users/${notification.userId}`)}>
            {notification.userName}
          </Button>
          created new post
        </Button>
      );
    case "NEW_COMMENT":
      return (
        <Button className="w-full h-20 bg-muted/30" variant="ghost" onClick={() => router.push(`/posts/${notification.postId}`)}>
          The user
          <Button variant="link" onClick={() => router.push(`/users/${notification.userId}`)}>
            {notification.userName}
          </Button>
          created new comment in your post
        </Button>
      );
    case "NEW_POST_LIKE":
      return (
        <Button className="w-full h-20 bg-muted/30" variant="ghost" onClick={() => router.push(`/posts/${notification.postId}`)}>
          The user
          <Button variant="link" onClick={() => router.push(`/users/${notification.userId}`)}>
            {notification.userName}
          </Button>
          likes you post
        </Button>
      );
    case "NEW_COMMENT_LIKE":
      return (
        <Button className="w-full h-20 bg-muted/30" variant="ghost" onClick={() => router.push(`/posts/${notification.postId}`)}>
          The user
          <Button variant="link" onClick={() => router.push(`/users/${notification.userId}`)}>
            {notification.userName}
          </Button>
          likes your comment
        </Button>
      );

    default:
      break;
  }
}
