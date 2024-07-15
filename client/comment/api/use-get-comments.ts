import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

type props = {
  userId?: string;
  postId: string;
};

export default function useGetComments({ userId, postId }: props) {
  const query = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const res = await client.api.v1.comment.$get({ query: { userId, postId } });

      // handle throw the error response
      if (!res.ok) {
        throw await handleErrors(res);
      }
      const { data } = await res.json();
      return data;
    },
  });

  return query;
}
