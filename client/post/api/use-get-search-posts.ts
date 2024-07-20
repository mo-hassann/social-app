import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

export default function useGetSearchPosts(searchQuery?: string) {
  const query = useQuery({
    queryKey: ["search_posts", searchQuery],
    queryFn: async () => {
      const res = await client.api.v1.post.$get({ query: { searchQuery } });

      // handle throw the error response
      if (!res.ok) {
        throw await handleErrors(res);
      }
      const { data } = await res.json();

      return data;
    },
    enabled: !!searchQuery,
  });

  return query;
}
