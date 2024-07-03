import db from "@/db";
import { userTable } from "@/db/schema";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you must log in" }, 401);
  })
  .post("/", (c) => c.json("create a book", 201))
  .get("/:id", zValidator("param", z.object({ id: z.string() })), (c) => c.json(`get ${c.req.param("id")}`));

export default app;
