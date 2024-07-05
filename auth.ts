import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./client/auth/schemas";
import client from "./lib/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log(credentials);
        const validatedFields = signInSchema.safeParse(credentials);

        console.log(validatedFields);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const res = await client.api.auth["auth-user"].$get({ json: { email, password } });
          if (!res.ok) return null;

          const { data: user } = await res.json();
          return user;
        }

        return null;
      },
    }),
  ],
});
