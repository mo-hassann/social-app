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
import { verifyAuth } from "@hono/auth-js";

const app = new Hono()
  .post("/post/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;
      const { id: postId } = c.req.valid("param");

      const [isLiked] = await db
        .select({ id: postLikeTable.id })
        .from(postLikeTable)
        .where(and(eq(postLikeTable.userId, curUserId), eq(postLikeTable.postId, postId)));

      // add the like and if already exist delete it
      if (isLiked) {
        await db.delete(postLikeTable).where(and(eq(postLikeTable.userId, curUserId), eq(postLikeTable.postId, postId)));
        await db
          .update(postTable)
          .set({ likeCount: sql`${postTable.likeCount} - 1` })
          .where(eq(postTable.id, postId));
      } else {
        await db.insert(postLikeTable).values({ postId, userId: curUserId });
        await db
          .update(postTable)
          .set({ likeCount: sql`${postTable.likeCount} + 1` })
          .where(eq(postTable.id, postId));
      }

      // await db.execute(sql`insert into ${postLikeTable} (${postLikeTable.postId}, ${postLikeTable.userId}) values (${values.postId},${values.userId}) on conflict do update`);

      return c.json({});
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to add like", cause: error?.message }, 400);
    }
  })
  .post("/comment/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;
      const { id: commentId } = c.req.valid("param");

      const [isLiked] = await db
        .select({ id: commentLikeTable.id })
        .from(commentLikeTable)
        .where(and(eq(commentLikeTable.userId, curUserId), eq(commentLikeTable.commentId, commentId)));

      // add the like and if already exist delete it
      if (isLiked) {
        await db.delete(commentLikeTable).where(and(eq(commentLikeTable.userId, curUserId), eq(commentLikeTable.commentId, commentId)));
        await db
          .update(commentTable)
          .set({ likeCount: sql`${commentTable.likeCount} - 1` })
          .where(eq(commentTable.id, commentId));
      } else {
        await db.insert(commentLikeTable).values({ commentId, userId: curUserId });
        await db
          .update(commentTable)
          .set({ likeCount: sql`${commentTable.likeCount} + 1` })
          .where(eq(commentTable.id, commentId));
      }

      return c.json({});
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to add like", cause: error?.message }, 400);
    }
  });

export default app;
