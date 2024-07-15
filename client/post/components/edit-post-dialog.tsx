import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Spinner from "@/components/spinner";
import { useGetUserId } from "@/hooks/use-get-user-id";
import { format } from "date-fns";
import useEditPostDialog from "../hooks/use-edit-post-dialog";
import useGetPost from "../api/use-get-post";
import useEditPost from "../api/use-edit-post";
import useGetPostToEdit from "../api/use-get-post-to-edit";
import EditPostForm from "./edit-post-form";

export default function EditPostDialog() {
  const { isOpen, onClose, postId } = useEditPostDialog();
  const editPostMutation = useEditPost(postId as string);
  const postToEditQuery = useGetPostToEdit(postId as string);

  const post = postToEditQuery.data;

  const isLoading = postToEditQuery.isLoading;
  const isError = postToEditQuery.isError;
  const isPending = postToEditQuery.isPending;
  const formDisabled = editPostMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>edit your profile details</DialogTitle>
        </DialogHeader>

        {(isLoading || isPending) && <Spinner />}
        {!isLoading && !isError && !isPending && post && (
          <EditPostForm
            defaultValues={{ ...post }}
            disabled={formDisabled}
            onSubmit={(values) => {
              editPostMutation.mutate(
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
