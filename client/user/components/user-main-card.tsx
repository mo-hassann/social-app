"use client";
import { Button } from "@/components/ui/button";
import useGetCurUser from "../api/use-get-cur-user";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/user-avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function UserMainCard() {
  const userQuery = useGetCurUser();

  if (userQuery.isLoading || userQuery.isPending) return <UserMainCardSkeleton />;
  if (userQuery.error) return;

  const { bio, dateOfBirth, email, followersCount, followingCount, id, image, name, username } = userQuery.data;

  return (
    <div className="w-[320px] mx-auto max-w-96 bg-card rounded-md overflow-hidden">
      <div className="w-full h-[120px] bg-primary" />
      <div className="flex justify-center gap-4 w-full">
        <div className="flex flex-col items-center mt-3">
          <span className="text-xl">{followingCount}</span>
          <span className="text-muted-foreground text-sm">Following</span>
        </div>
        <UserAvatar className="size-20 -my-7 text-2xl" image={image || undefined} fallbackText={username} />
        <div className="flex flex-col items-center mt-3">
          <span className="text-xl">{followersCount}</span>
          <span className="text-muted-foreground text-sm">Followers</span>
        </div>
      </div>
      <div className="flex flex-col items-center my-3 px-3 text-center">
        <h3 className="text-2xl capitalize">{name}</h3>
        <p className="text-muted-foreground text-sm">@{username}</p>
        <p className="py-5">{bio} </p>
      </div>
      <Separator />
      <div className="flex items-center">
        <Button className="w-full m-3 py-6" asChild>
          <Link href="/profile">My Profile</Link>
        </Button>
      </div>
    </div>
  );
}

const UserMainCardSkeleton = () => (
  <div className="space-y-3 w-80">
    <Skeleton className="h-[50px] w-4/5 max-w-96" />
    <Skeleton className="h-[300px] w-full max-w-96" />
  </div>
);
