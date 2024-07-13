import { create } from "zustand";

type comment = { id: string; content: string };

interface ReplayCommentI {
  comment: comment | null;
  setReplayComment: (comment: comment | null) => void;
}

const useReplayComment = create<ReplayCommentI>((set) => ({
  comment: null,
  setReplayComment: (comment) => set({ comment }),
}));

export default useReplayComment;
