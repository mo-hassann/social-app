"use client";
import UserFollowingMainCard from "@/client/user/components/user-following-main-card";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function RightSidebar({ className }: { className: string }) {
  const pathname = usePathname();

  if (pathname.startsWith("/users") || pathname.startsWith("/following")) return;

  return (
    <div className={cn(className)}>
      <UserFollowingMainCard />
    </div>
  );
}
