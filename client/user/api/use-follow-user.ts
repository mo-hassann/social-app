import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import client from "@/server/client";
import { InferRequestType, InferResponseType } from "hono";
import { handleErrors } from "@/lib/errors";

const $post = client.api.v1.user.follow[":id"].$post;

type resT = InferResponseType<typeof $post>;
type reqT = InferRequestType<typeof $post>["param"];

export default function useFollowUser() {
  const queryClient = useQueryClient();
  const mutation = useMutation<resT, Error, reqT>({
    mutationFn: async ({ id }) => {
      const res = await $post({ param: { id } });

      // handle throw the error response
      if (!res.ok) {
        throw await handleErrors(res);
      }
      return await res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      toast.success("post added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}
