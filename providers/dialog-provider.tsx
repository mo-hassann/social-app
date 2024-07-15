"use client";

import EditCommentDialog from "@/client/comment/components/edit-comment-dialog";
import EditPostDialog from "@/client/post/components/edit-post-dialog";
import EditProfileDialog from "@/client/user/components/edit-profile-dialog";

export default function DialogProvider() {
  return (
    <>
      <EditProfileDialog />
      <EditPostDialog />
      <EditCommentDialog />
    </>
  );
}
