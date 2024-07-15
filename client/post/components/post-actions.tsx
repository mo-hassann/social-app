import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit2, EllipsisVertical, Trash2 } from "lucide-react";
import useDeletePost from "../api/use-delete-post";
import Spinner from "@/components/spinner";
import useConfirm from "@/hooks/use-confirm";
import useEditPostDialog from "../hooks/use-edit-post-dialog";

type props = {
  postId: string;
};

export default function PostActions({ postId }: props) {
  const [ConfirmationDialog, confirm] = useConfirm();
  const { onOpen } = useEditPostDialog();
  const deletePostMutation = useDeletePost();
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
              onOpen(postId);
            }}
          >
            <Edit2 size={16} className="mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            onClick={async () => {
              const ok = await confirm();
              if (ok) {
                deletePostMutation.mutate({ id: postId });
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
