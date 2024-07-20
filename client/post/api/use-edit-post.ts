import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import client from "@/server/client";
import { InferRequestType, InferResponseType } from "hono";
import { handleErrors } from "@/lib/errors";

const $patch = client.api.v1.post[":id"].$patch;

type resT = InferResponseType<typeof $patch>;
type reqT = InferRequestType<typeof $patch>["json"];

export default function useEditPost(postId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation<resT, Error, reqT>({
    mutationFn: async (values) => {
      const res = await $patch({ json: { ...values }, param: { id: postId } });

      // handle throw the error response
      if (!res.ok) {
        throw await handleErrors(res);
      }
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["post_edit", postId] });
      queryClient.invalidateQueries({ queryKey: ["trending_tags"] });
      if ("data" in data) {
        queryClient.invalidateQueries({ queryKey: ["user_posts", data.data.userId] });
      }
      toast.success("post added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}
