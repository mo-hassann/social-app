import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

export default function useGetCurUserSuggestion() {
  const query = useQuery({
    queryKey: ["cur_user_suggestion"],
    queryFn: async () => {
      const res = await client.api.v1.user["suggested-users"].$get();

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
