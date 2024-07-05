import { NextAuthConfig } from "next-auth";
import getUserWithEmailAndPassword from "./client/auth/libs/get-user-with-email-and-password";
import { signInSchema } from "./client/auth/schemas";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log(credentials);
        const validatedFields = signInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserWithEmailAndPassword({ email, password });

          return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
