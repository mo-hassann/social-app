import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

export default function useGetCommentToEdit(commentId: string) {
  const query = useQuery({
    queryKey: ["comment", commentId],
    queryFn: async () => {
      const res = await client.api.v1.comment[":id"]["to-edit"].$get({ param: { id: commentId } });

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
