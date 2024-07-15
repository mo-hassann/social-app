import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

type props = {
  userId?: string;
};

export default function useGetPosts({ userId }: props) {
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await client.api.v1.post.$get();

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
