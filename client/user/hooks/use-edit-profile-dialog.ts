import { create } from "zustand";

interface Dialog {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useEditProfileDialog = create<Dialog>((set) => ({
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: () => set(() => ({ isOpen: true })),
}));

export default useEditProfileDialog;
