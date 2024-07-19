import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

export default function useGetNotifications() {
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await client.api.v1.notifications.$get();

      // handle throw the error response
      if (!res.ok) {
        throw await handleErrors(res);
      }
      const { data } = await res.json();
      return data;
    },
    gcTime: 0,
  });

  return query;
}
