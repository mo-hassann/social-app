import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

export default function useGetCurUser() {
  const query = useQuery({
    queryKey: ["cur_user"],
    queryFn: async () => {
      const res = await client.api.v1.user.$get();

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
