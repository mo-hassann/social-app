import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import db from "@/db";
import { postTable, postToTagTable, tagSchema, tagTable } from "@/db/schemas/post";
import { and, count, eq, sql, sum } from "drizzle-orm";
import { addPostLikeSchema, newPostFormSchema } from "@/validators";
import { userTable } from "@/db/schemas/user";
import { commentTable, subCommentTable } from "@/db/schemas/comment";
import { postLikeTable } from "@/db/schemas/like";

const app = new Hono()
  .get("/", zValidator("query", z.object({ postId: z.string(), userId: z.string().optional() })), async (c) => {
    try {
      const values = c.req.valid("query");

      let isUserLike = false;

      if (values.userId) {
        isUserLike = await db
          .select({ id: postLikeTable.id })
          .from(postLikeTable)
          .where(and(eq(postLikeTable.userId, values.userId), eq(postLikeTable.postId, values.postId)))
          .then((like) => (like[0] ? true : false));
      }
      return c.json({ data: { isUserLike } });
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to add like", cause: error?.message }, 400);
    }
  })
  .post("/", zValidator("json", addPostLikeSchema), async (c) => {
    try {
      const values = c.req.valid("json");

      const [currentLike] = await db
        .select()
        .from(postLikeTable)
        .where(and(eq(postLikeTable.userId, values.userId), eq(postLikeTable.postId, values.postId)));

      // add the like and if already exist delete it
      if (!currentLike) {
        await db.insert(postLikeTable).values(values);
      } else {
        await db.delete(postLikeTable).where(and(eq(postLikeTable.userId, values.userId), eq(postLikeTable.postId, values.postId)));
      }

      // await db.execute(sql`insert into ${postLikeTable} (${postLikeTable.postId}, ${postLikeTable.userId}) values (${values.postId},${values.userId}) on conflict do update`);

      return c.json({});
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to add like", cause: error?.message }, 400);
    }
  });

export default app;
