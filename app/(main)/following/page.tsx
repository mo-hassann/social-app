"use client";
import useGetCurUserFollowing from "@/client/user/api/use-get-cur-user-following";
import ErrorCard from "@/components/error-card";
import UserAvatar from "@/components/user-avatar";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export default function FollowingPage() {
  const userFollowingQuery = useGetCurUserFollowing();

  const isError = userFollowingQuery.isError;
  const isLoading = userFollowingQuery.isLoading || userFollowingQuery.isPending;

  if (isError) return <ErrorCard />;
  if (isLoading) return <div>loading...</div>;

  return (
    <div>
      <h1 className="text-2xl mb-3">followers</h1>
      {userFollowingQuery.data.map((user) => (
        <Link key={user.id} href={`/users/${user.id}`} className="flex items-center p-2 rounded-md gap-2 bg-muted/10 hover:bg-muted/40">
          <UserAvatar className="size-20" fallbackText={user.username} image={user.image || undefined} />
          <div>
            <p className="text-lg">{user.name}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
          <ExternalLinkIcon size={16} className="text-muted-foreground ml-auto" />
        </Link>
      ))}
    </div>
  );
}
