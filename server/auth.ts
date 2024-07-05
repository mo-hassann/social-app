import db from "@/db";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { eq, and } from "drizzle-orm";

import { userTable } from "@/db/schemas/user";
import { signIn } from "@/auth";
import { signInSchema } from "@/client/auth/schemas";

const app = new Hono()
  .post("/sign-in-user", zValidator("json", signInSchema), async (c) => {
    try {
      const data = c.req.valid("json");
      const existingUser = await db
        .select({ email: userTable.email })
        .from(userTable)
        .where(eq(userTable.email, data.email))
        .then((table) => table[0]);

      if (!existingUser) return c.json({ message: "email does not exist.", cause: undefined }, 404);

      await signIn("credentials", data);

      return c.json({ data: null });
    } catch (error: any) {
      const cause = (error instanceof Error && error.message) || undefined;
      console.log("SERVER ERROR. CAUSE: ", cause);
      return c.json({ message: "field to get user", cause }, 400);
    }
  })
  .get("/auth-user", zValidator("json", signInSchema), async (c) => {
    try {
      const data = c.req.valid("json");
      const existingUser = await db
        .select()
        .from(userTable)
        .where(and(eq(userTable.email, data.email), eq(userTable.password, data.password)))
        .then((table) => table[0]);

      if (!existingUser) return c.json({ message: "email does not exist.", cause: undefined }, 404);

      return c.json({ data: existingUser });
    } catch (error: any) {
      const cause = (error instanceof Error && error.message) || undefined;
      console.log("SERVER ERROR. CAUSE: ", cause);
      return c.json({ message: "field to get user", cause }, 400);
    }
  });

export default app;
