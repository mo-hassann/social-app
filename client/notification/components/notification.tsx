import Link from "next/link";

import NotificationItem from "./notification-item";

import { FaMessage, FaUserGroup } from "react-icons/fa6";
import { BiSolidLike, BiSolidMessageEdit } from "react-icons/bi";

type props = {
  notification: {
    id: string;
    userName: string | null;
    userId: string;
    notificationName: "NEW_POST" | "NEW_COMMENT" | "NEW_POST_LIKE" | "NEW_COMMENT_LIKE" | "NEW_FOLLOWER";
    postId: string | null;
    commentId: string | null;
    isRead: boolean;
  };
};

export default function Notification({ notification }: props) {
  switch (notification.notificationName) {
    case "NEW_POST":
      return (
        <NotificationItem
          id={notification.id}
          title="new post from your following"
          icon={BiSolidMessageEdit}
          isRead={notification.isRead}
          notificationLink={`/posts/${notification.postId}`}
          description={
            <>
              The user
              <Link className="hover:underline text-primary mx-1" href={`/users/${notification.userId}`}>
                @{notification.userName}
              </Link>
              created new post
            </>
          }
        />
      );
    case "NEW_COMMENT":
      return (
        <NotificationItem
          id={notification.id}
          title="new comment in your post from your followers"
          icon={FaMessage}
          isRead={notification.isRead}
          notificationLink={`/posts/${notification.postId}`}
          description={
            <>
              The user
              <Link className="hover:underline text-primary mx-1" href={`/users/${notification.userId}`}>
                @{notification.userName}
              </Link>
              created new comment in your recent post
            </>
          }
        />
      );
    case "NEW_POST_LIKE":
      return (
        <NotificationItem
          id={notification.id}
          title="new like to one of your posts"
          icon={BiSolidLike}
          isRead={notification.isRead}
          notificationLink={`/posts/${notification.postId}`}
          description={
            <>
              The user
              <Link className="hover:underline text-primary mx-1" href={`/users/${notification.userId}`}>
                @{notification.userName}
              </Link>
              likes your post
            </>
          }
        />
      );
    case "NEW_COMMENT_LIKE":
      return (
        <NotificationItem
          id={notification.id}
          title="new like to one of your comments"
          icon={BiSolidLike}
          isRead={notification.isRead}
          notificationLink={`/posts/${notification.postId}`}
          description={
            <>
              The user
              <Link className="hover:underline text-primary mx-1" href={`/users/${notification.userId}`}>
                @{notification.userName}
              </Link>
              likes one of your comments
            </>
          }
        />
      );
    case "NEW_FOLLOWER":
      return (
        <NotificationItem
          id={notification.id}
          title="new follower to your account"
          icon={FaUserGroup}
          isRead={notification.isRead}
          notificationLink={`/posts/${notification.userId}`}
          description={
            <>
              The user
              <Link className="hover:underline text-primary mx-1" href={`/users/${notification.userId}`}>
                @{notification.userName}
              </Link>
              follow you
            </>
          }
        />
      );

    default:
      break;
  }
}
