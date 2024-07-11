import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

type props = {
  postId: string;
  userId?: string;
};

export default function useGetLikeState(values: props) {
  const query = useQuery({
    queryKey: ["like_count", values.postId],
    queryFn: async () => {
      const res = await client.api.v1.like.$get({ query: values });

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
