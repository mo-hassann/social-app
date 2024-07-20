import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

export default function useIsNewNotification() {
  const query = useQuery({
    queryKey: ["new_notifications"],
    queryFn: async () => {
      const res = await client.api.v1.notifications["is-new-notification"].$get();

      // handle throw the error response
      if (!res.ok) {
        throw await handleErrors(res);
      }
      const { data } = await res.json();
      return data;
    },
    gcTime: 0,
    refetchInterval: 1 * 1000 * 60, // checks every 1 minute
  });

  return query;
}
