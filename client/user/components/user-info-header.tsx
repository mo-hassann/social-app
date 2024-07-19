import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import FollowBtn from "./follow-btn";
import useEditProfileDialog from "../hooks/use-edit-profile-dialog";
import { Edit } from "lucide-react";
import Spinner from "@/components/spinner";
import NewPostForm from "@/client/post/components/new-post-form";
import useNewPost from "@/client/post/api/use-new-post";

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
  const postMutation = useNewPost();
  const isPending = postMutation.isPending;

  return (
    <div className="mb-4">
      <div className="w-full h-52 rounded-lg overflow-hidden bg-primary" />

      <div className="flex items-center gap-3">
        <UserAvatar className="size-32 -mt-12 mx-3 border-[5px] border-background" fallbackText={user.username} image={user.image || undefined} />

        <div className="mr-auto">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <span className="text-muted-foreground mr-2">@{user.username}</span>
          <span>{user.email}</span>
        </div>
        {!curUserId && <Spinner />}
        {curUserId && curUserId === user.id && (
          <Button variant="outline" onClick={() => onEditProfileDialogOpen()}>
            <Edit size={16} className="mr-2" /> edit profile
          </Button>
        )}
        {curUserId && curUserId !== user.id && <FollowBtn userId={user.id} isFollowed={user.isFollowed} />}
      </div>
      <div className="p-3 mt-3 rounded-lg">
        <p className="mt-3">{user.bio}</p>
        <div className="flex gap-5 text-muted-foreground">
          <p>
            <span className="text-foreground font-bold">{user.followingCount}</span> following
          </p>
          <p>
            <span className="text-foreground font-bold">{user.followersCount}</span> followers
          </p>
        </div>
      </div>
      {curUserId && curUserId === user.id && <NewPostForm curUser={{ name: user.name, image: user.image || undefined }} defaultValues={{ content: "", image: null }} isPending={isPending} onSubmit={(values) => postMutation.mutate({ ...values })} />}
    </div>
  );
}
