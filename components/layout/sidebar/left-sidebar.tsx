import HashtagsMainCard from "@/client/hashtags/components/hashtags-main-card";
import UserMainCard from "@/client/user/components/user-main-card";
import { cn } from "@/lib/utils";

export default function LeftSidebar({ className }: { className: string }) {
  return (
    <div className={cn("space-y-5", className)}>
      <UserMainCard />
      <HashtagsMainCard />
    </div>
  );
}
