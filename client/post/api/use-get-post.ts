import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

export default function useGetPost(postId: string) {
  const query = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await client.api.v1.post[":id"].$get({ param: { id: postId } });

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
