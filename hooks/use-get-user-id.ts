import { type AdapterSession, type AdapterUser } from "@auth/core/adapters";
import { useQuery } from "@tanstack/react-query";

export const useGetUserId = () => {
  const { data, status } = useQuery({
    queryKey: ["@AUTH_SESSION_USER_ID"],
    queryFn: async () => {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const session = (await res.json()) as { user: AdapterUser } & AdapterSession;

      return session.user.id;
    },
    staleTime: Infinity,
  });
  return data;
};
