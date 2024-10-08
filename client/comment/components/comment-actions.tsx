import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit2, EllipsisVertical, Trash2 } from "lucide-react";

import Spinner from "@/components/spinner";
import useConfirm from "@/hooks/use-confirm";
import useDeleteComment from "../api/use-delete-comment";
import useEditCommentDialog from "../hooks/use-edit-comment-dialog";

type props = {
  commentId: string;
};

export default function CommentActions({ commentId }: props) {
  const [ConfirmationDialog, confirm] = useConfirm();
  const { onOpen } = useEditCommentDialog();
  const deletePostMutation = useDeleteComment();
  const isPending = deletePostMutation.isPending;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical size={12} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={isPending}
            onClick={async () => {
              onOpen(commentId);
            }}
          >
            <Edit2 size={16} className="mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            onClick={async () => {
              const ok = await confirm();
              if (ok) {
                deletePostMutation.mutate({ id: commentId });
              }
            }}
          >
            {isPending ? <Spinner size={16} className="mr-2" /> : <Trash2 size={16} className="mr-2" />}
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog />
    </>
  );
}
