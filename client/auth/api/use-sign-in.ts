import client from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type resT = InferResponseType<(typeof client.api.auth)["sign-in-user"]["$post"]>;
type reqT = InferRequestType<(typeof client.api.auth)["sign-in-user"]["$post"]>["json"];

export default function useSignIn() {
  const mutation = useMutation<resT, Error, reqT>({
    mutationFn: async (user) => {
      const res = await client.api.auth["sign-in-user"].$post({ json: user });

      if (!res.ok) {
        const error = await res.json();
        if ("message" in error) {
          throw new Error(error.message, {
            cause: error.cause,
          });
        } else {
          throw new Error("unknown error");
        }
      }

      return res.json();
    },
    onSuccess: () => toast.success("user logged in successfully"),
    onError: (error) => toast.error(error.message),
  });
  return mutation;
}
