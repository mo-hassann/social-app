import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import client from "@/server/client";
import { InferRequestType, InferResponseType } from "hono";
import { handleErrors } from "@/lib/errors";

const $delete = client.api.v1.post[":id"].$delete;

type resT = InferResponseType<typeof $delete>;
type reqT = InferRequestType<typeof $delete>["param"];

export default function useDeletePost() {
  const queryClient = useQueryClient();
  const mutation = useMutation<resT, Error, reqT>({
    mutationFn: async ({ id }) => {
      const res = await $delete({ param: { id } });

      // handle throw the error response
      if (!res.ok) {
        throw await handleErrors(res);
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("post added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}
