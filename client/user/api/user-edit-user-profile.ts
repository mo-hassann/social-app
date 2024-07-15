import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import client from "@/server/client";
import { InferRequestType, InferResponseType } from "hono";
import { handleErrors } from "@/lib/errors";

const $patch = client.api.v1.user.$patch;

type resT = InferResponseType<typeof $patch>;
type reqT = InferRequestType<typeof $patch>["json"];

export default function useEditUserProfile() {
  const queryClient = useQueryClient();
  const mutation = useMutation<resT, Error, reqT>({
    mutationFn: async (values) => {
      console.log(values, "from mutation");
      const res = await $patch({ json: { ...values } });

      // handle throw the error response
      if (!res.ok) {
        throw await handleErrors(res);
      }
      return await res.json();
    },
    onSuccess: (data) => {
      if ("data" in data) {
        queryClient.invalidateQueries({ queryKey: ["user", data.data.userId] });
      }
      toast.success("post updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}
