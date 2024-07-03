import db from "@/db";
import { userSchema, userTable } from "@/db/schema";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you must log in" }, 401);

    try {
      const data = await db.select().from(userTable).where(eq(userTable.id, userId));

      return c.json({ data });
    } catch (error: any) {
      const cause = (error instanceof Error && error.message) || undefined;
      console.log("SERVER ERROR. CAUSE: ", cause);
      return c.json({ message: "field to get user", cause }, 400);
    }
  })
  .post("/create", zValidator("json", userSchema), async (c) => {
    const user = c.req.valid("json");

    try {
      const data = await db.insert(userTable).values({ ...user });

      return c.json({ data });
    } catch (error) {
      const cause = (error instanceof Error && error.message) || undefined;
      console.log("SERVER ERROR. CAUSE: ", cause);
      return c.json({ message: "field to create user", cause }, 400);
    }
  })
  .get("/:id", zValidator("param", z.object({ id: z.string() })), (c) => c.json(`get ${c.req.param("id")}`));

export default app;
