import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditProfileForm from "./edit-profile-form";
import useEditProfileDialog from "../hooks/use-edit-profile-dialog";
import useGetUser from "../api/use-get-user";
import Spinner from "@/components/spinner";
import { useGetUserId } from "@/hooks/use-get-user-id";
import useEditUserProfile from "../api/user-edit-user-profile";
import { format } from "date-fns";

export default function EditProfileDialog() {
  const { isOpen, onClose } = useEditProfileDialog();
  const userId = useGetUserId();
  const userQuery = useGetUser({ userId: userId as string });
  const userMutation = useEditUserProfile();

  const user = userQuery.data;

  const isLoading = userQuery.isLoading;
  const isError = userQuery.isError;
  const isPending = userQuery.isPending;
  const formDisabled = userMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>edit your profile details</DialogTitle>
        </DialogHeader>

        {(isLoading || isPending) && <Spinner />}
        {!isLoading && !isError && !isPending && user && (
          <EditProfileForm
            defaultValues={{ bio: user.bio, dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null, name: user.name, userName: user.username }}
            disabled={formDisabled}
            onSubmit={(values) => {
              userMutation.mutate(
                { ...values },
                {
                  onSuccess() {
                    onClose();
                  },
                }
              );
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
