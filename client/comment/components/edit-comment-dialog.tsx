import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Spinner from "@/components/spinner";

import EditCommentForm from "./edit-comment-form";
import useEditCommentDialog from "../hooks/use-edit-comment-dialog";
import useEditComment from "../api/use-edit-comment";
import useGetCommentToEdit from "../api/use-get-comment-to-edit";

export default function EditCommentDialog() {
  const { isOpen, onClose, commentId } = useEditCommentDialog();
  const editCommentMutation = useEditComment(commentId as string);
  const commentToEditQuery = useGetCommentToEdit(commentId as string);

  const post = commentToEditQuery.data;

  const isLoading = commentToEditQuery.isLoading;
  const isError = commentToEditQuery.isError;
  const isPending = commentToEditQuery.isPending;
  const formDisabled = editCommentMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>edit your profile details</DialogTitle>
        </DialogHeader>

        {(isLoading || isPending) && <Spinner />}
        {!isLoading && !isError && !isPending && post && (
          <EditCommentForm
            defaultValues={{ ...post }}
            disabled={formDisabled}
            onSubmit={(values) => {
              editCommentMutation.mutate(
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
