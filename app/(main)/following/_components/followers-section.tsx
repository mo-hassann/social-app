import useGetCurUserFollowers from "@/client/user/api/use-get-cur-user-followers";
import ErrorCard from "@/components/error-card";
import UserAvatar from "@/components/user-avatar";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import LoadingSkeleton from "./loading-skeleton";
import NoDataCard from "@/components/no-data-card";

const FollowersSection = () => {
  const userFollowersQuery = useGetCurUserFollowers();

  const isError = userFollowersQuery.isError;
  const isLoading = userFollowersQuery.isLoading || userFollowersQuery.isPending;

  if (isError) return <ErrorCard />;
  if (isLoading) return <LoadingSkeleton />;
  if (userFollowersQuery.data.length === 0) return <NoDataCard />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {userFollowersQuery.data.map((user) => (
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
};

export default FollowersSection;
