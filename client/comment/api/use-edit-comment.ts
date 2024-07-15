import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import client from "@/server/client";
import { InferRequestType, InferResponseType } from "hono";
import { handleErrors } from "@/lib/errors";

const $patch = client.api.v1.comment[":id"].$patch;

type resT = InferResponseType<typeof $patch>;
type reqT = InferRequestType<typeof $patch>["json"];

export default function useEditComment(commentId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation<resT, Error, reqT>({
    mutationFn: async (values) => {
      const res = await $patch({ json: { ...values }, param: { id: commentId } });

      // handle throw the error response
      if (!res.ok) {
        throw await handleErrors(res);
      }
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comment", commentId] });
      if ("data" in data) {
        queryClient.invalidateQueries({ queryKey: ["comments", data.data.postId] });
      }
      toast.success("comment added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}
