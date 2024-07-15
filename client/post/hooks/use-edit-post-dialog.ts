import { create } from "zustand";

interface Dialog {
  postId: string | null;
  isOpen: boolean;
  onOpen: (postId: string) => void;
  onClose: () => void;
}

const useEditPostDialog = create<Dialog>((set) => ({
  postId: null,
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: (postId) => set(() => ({ isOpen: true, postId })),
}));

export default useEditPostDialog;
