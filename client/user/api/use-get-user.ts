import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";

import { handleErrors } from "@/lib/errors";

type props = {
  userId: string;
  enabled?: boolean;
};

export default function useGetUser({ userId, enabled = true }: props) {
  const query = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await client.api.v1.user[":id"].$get({ param: { id: userId } });

      // handle throw the error response
      if (!res.ok) {
        throw await handleErrors(res);
      }
      const { data } = await res.json();

      return data;
    },
    enabled: enabled && !!userId,
  });

  return query;
}
