import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import db from "@/db";
import { postTable, postToTagTable, tagSchema, tagTable } from "@/db/schemas/post";
import { and, count, eq, sql, sum } from "drizzle-orm";
import { addCommentLikeSchema, addPostLikeSchema, newPostFormSchema } from "@/validators";
import { userTable } from "@/db/schemas/user";
import { commentTable } from "@/db/schemas/comment";
import { commentLikeTable, postLikeTable } from "@/db/schemas/like";

const app = new Hono()
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
  })
  .post("/comment", zValidator("json", addCommentLikeSchema), async (c) => {
    try {
      const values = c.req.valid("json");

      const [currentLike] = await db
        .select()
        .from(commentLikeTable)
        .where(and(eq(commentLikeTable.userId, values.userId), eq(commentLikeTable.commentId, values.commentId)));

      // add the like and if already exist delete it
      if (!currentLike) {
        await db.insert(commentLikeTable).values(values);
      } else {
        await db.delete(commentLikeTable).where(and(eq(commentLikeTable.userId, values.userId), eq(commentLikeTable.commentId, values.commentId)));
      }

      return c.json({});
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to add like", cause: error?.message }, 400);
    }
  });

export default app;
