import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { DEFAULT_AUTH_ERROR_REDIRECT } from "./routes";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    error: DEFAULT_AUTH_ERROR_REDIRECT,
  },
  ...authConfig,
});
