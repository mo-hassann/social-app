"use client";
import UserFollowingMainCard from "@/client/user/components/user-following-main-card";
import UserSuggestionMainCard from "@/client/user/components/user-suggestion-main-card";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function RightSidebar({ className }: { className: string }) {
  const pathname = usePathname();

  if (pathname.startsWith("/users") || pathname.startsWith("/following")) return;

  return (
    <div className={cn("space-y-5", className)}>
      <UserFollowingMainCard />
      <UserSuggestionMainCard />
    </div>
  );
}
