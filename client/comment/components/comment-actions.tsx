import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash2 } from "lucide-react";

import Spinner from "@/components/spinner";
import useConfirm from "@/hooks/use-confirm";
import useDeleteComment from "../api/use-delete-comment";

type props = {
  commentId: string;
};

export default function CommentActions({ commentId }: props) {
  const [ConfirmationDialog, confirm] = useConfirm();
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
