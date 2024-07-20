import { cn } from "@/lib/utils";
import Link from "next/link";
import type { IconType } from "react-icons/lib";
import useSetReadNotification from "../api/set-is-read";

type props = {
  id: string;
  icon: IconType;
  notificationLink: string;
  title: string;
  description: React.ReactNode;
  isRead: boolean;
};

export default function NotificationItem({ id, description, notificationLink, title, isRead, icon: Icon }: props) {
  const notificationReadMutation = useSetReadNotification();

  return (
    <Link href={notificationLink} onClick={() => !isRead && notificationReadMutation.mutate({ id })} className={cn("w-full h-20 flex items-center gap-2 p-3 rounded-md bg-primary/15 hover:bg-primary/25", isRead && "bg-card/15 hover:bg-card/25")}>
      <div className="bg-primary/40 rounded-full flex items-center justify-center size-12">
        <Icon />
      </div>
      <div>
        <h3 className="text-lg capitalize">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {!isRead && <div className="size-2 rounded-full bg-primary ml-auto shrink-0" />}
    </Link>
  );
}
