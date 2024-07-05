import client from "@/server/client";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SignIn from "../actions/sign-in";

type resT = InferResponseType<(typeof client.api.v1)["user-auth"]["sign-in-user"]["$post"]>;
type reqT = InferRequestType<(typeof client.api.v1)["user-auth"]["sign-in-user"]["$post"]>["json"];

export default function useSignIn() {
  const router = useRouter();
  const mutation = useMutation<any, Error, reqT>({
    mutationFn: SignIn,
    onSuccess: () => {
      router.refresh();
      toast.success("user logged in successfully");
    },
    onError: (error) => {
      console.log(error);

      toast.error(error.message);
    },
  });

  return mutation;
}
