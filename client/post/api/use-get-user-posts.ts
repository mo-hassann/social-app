import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

type props = {
  userId: string;
};

export default function useGetUserPosts({ userId }: props) {
  const query = useQuery({
    queryKey: ["user_posts", userId],
    queryFn: async () => {
      const res = await client.api.v1.post["user-posts"].$get({ query: { userId } });

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
