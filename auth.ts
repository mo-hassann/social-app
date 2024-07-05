import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  ...authConfig,
});
