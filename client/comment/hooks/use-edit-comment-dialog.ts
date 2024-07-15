import { create } from "zustand";

interface Dialog {
  commentId: string | null;
  isOpen: boolean;
  onOpen: (commentId: string) => void;
  onClose: () => void;
}

const useEditCommentDialog = create<Dialog>((set) => ({
  commentId: null,
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: (commentId) => set(() => ({ isOpen: true, commentId })),
}));

export default useEditCommentDialog;
