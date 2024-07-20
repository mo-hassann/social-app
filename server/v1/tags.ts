import { Hono } from "hono";
import db from "@/db";

import { postToTagTable, tagTable } from "@/db/schemas/post";
import { count, desc, eq } from "drizzle-orm";

const app = new Hono().get("/trending", async (c) => {
  try {
    const data = await db
      .select({ name: tagTable.name, tagCount: count(postToTagTable.postId) })
      .from(postToTagTable)
      .leftJoin(tagTable, eq(postToTagTable.tagId, tagTable.id))
      .orderBy(desc(count(postToTagTable.postId)))
      .groupBy(tagTable.name)
      .limit(10);

    return c.json({ data });
  } catch (error: any) {
    return c.json({ message: "something wrong when trying to add like", cause: error?.message }, 400);
  }
});

export default app;
