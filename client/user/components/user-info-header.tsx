import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import FollowBtn from "./follow-btn";
import useEditProfileDialog from "../hooks/use-edit-profile-dialog";
import { Edit } from "lucide-react";
import Spinner from "@/components/spinner";

type props = {
  curUserId?: string;
  user: {
    id: string;
    name: string;
    username: string;
    backgroundImage: string | null;
    image: string | null;
    bio: string | null;
    email: string;
    followingCount: number;
    followersCount: number;
    isFollowed: boolean;
  };
};

export default function UserInfoHeader({ user, curUserId }: props) {
  const { onOpen: onEditProfileDialogOpen } = useEditProfileDialog();
  return (
    <div>
      <div className="w-full h-40 rounded-lg overflow-hidden bg-primary" />

      <div className="flex items-center gap-3">
        <UserAvatar className="size-32 -mt-12 mx-3" fallbackText={user.username} image={user.image || undefined} />

        <div className="mr-auto">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          lorem
          <p className="text-primary">@{user.username}</p>
        </div>
        {!curUserId && <Spinner />}
        {typeof curUserId === "string" && curUserId === user.id && (
          <Button variant="outline" onClick={() => onEditProfileDialogOpen()}>
            <Edit size={16} className="mr-2" /> edit profile
          </Button>
        )}
        {typeof curUserId === "string" && curUserId !== user.id && <FollowBtn userId={user.id} isFollowed={user.isFollowed} />}
        <div>
          <p>following: {user.followingCount}</p>
          <p>followers: {user.followersCount}</p>
        </div>
      </div>
      <div className="bg-muted p-3 mt-3 rounded-lg">
        <h3 className="text-2xl font-bold">About</h3>
        <p>Email: {user.email}</p>
        <p className="mt-3">{user.bio}</p>
      </div>
    </div>
  );
}
