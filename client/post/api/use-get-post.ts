import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

type props = {
  userId?: string;
  postId: string;
};

export default function useGetPost({ userId, postId }: props) {
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await client.api.v1.post[":id"].$get({ param: { id: postId } });

      // handle throw the error response
      if (!res.ok) {
        throw await handleErrors(res);
      }
      const { data } = await res.json();
      console.log(data, "posts------------");
      return data;
    },
  });

  return query;
}
