import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import client from "@/server/client";
import { handleErrors } from "@/lib/errors";

const $post = client.api.v1["user"]["sign-out"]["$post"];

export default function useSignOut() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await $post();

      // handle throw the error response
      if (!res.ok) {
        throw await handleErrors(res);
      }
    },
    onSuccess: () => {
      toast.success("signed out successfully");
      router.push("/sign-in");
    },
    onError: (error) => {
      console.log(error);

      toast.error(error.message);
    },
  });

  return mutation;
}
