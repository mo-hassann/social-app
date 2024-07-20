import { ReplyAll, X } from "lucide-react";
import useReplayComment from "../hooks/use-comment-replay";

export default function ReplayCommentBar() {
  const replayComment = useReplayComment((state) => state.comment);
  const setReplayComment = useReplayComment((state) => state.setReplayComment);
  return (
    replayComment && (
      <div className="p-3 flex items-center gap-2 bg-card text-sm rounded-t-sm">
        <ReplyAll size={14} />
        <p>{replayComment.content}</p>
        <X size={14} onClick={() => setReplayComment(null)} className="ml-auto cursor-pointer" />
      </div>
    )
  );
}
