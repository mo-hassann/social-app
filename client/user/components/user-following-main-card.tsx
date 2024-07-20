"use client";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/user-avatar";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import useGetCurUserFollowing from "../api/use-get-cur-user-following";
import { Skeleton } from "@/components/ui/skeleton";
import NoDataCard from "@/components/no-data-card";

export default function UserFollowingMainCard() {
  const userFollowingQuery = useGetCurUserFollowing();

  const isError = userFollowingQuery.isError;
  const isLoading = userFollowingQuery.isLoading || userFollowingQuery.isPending;

  if (isError) return;
  if (isLoading) return <UserFollowingMainCardSkeleton />;
  if (userFollowingQuery.data.length === 0) return;

  return (
    <div className="w-[320px] mx-auto max-w-96 bg-card rounded-md overflow-hidden py-3 px-5">
      <h2 className="text-xl mb-3 pl-3">Your following</h2>
      <Separator />
      <div className="space-y-1 my-2">
        {userFollowingQuery.data.map((user) => (
          <Link key={user.id} href={`/users/${user.id}`} className="flex items-center p-2 rounded-md gap-2 hover:bg-muted/40">
            <UserAvatar className="size-12" fallbackText={user.username} image={user.image || undefined} />
            <div>
              <p>{user.name}</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
            <ExternalLinkIcon size={16} className="text-muted-foreground ml-auto" />
          </Link>
        ))}
      </div>
    </div>
  );
}

const UserFollowingMainCardSkeleton = () => (
  <div className="flex items-center gap-2 w-full">
    <Skeleton className="size-16 rounded-full shrink-0" />
    <div className="w-full space-y-2">
      <Skeleton className="w-8/12 h-7 rounded-md" />
      <Skeleton className="w-full h-7 rounded-md" />
    </div>
  </div>
);
