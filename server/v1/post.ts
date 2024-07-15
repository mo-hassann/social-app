import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import db from "@/db";
import { postTable, postToTagTable, tagSchema, tagTable } from "@/db/schemas/post";
import { and, count, desc, eq, exists, isNotNull, isNull, sql, sum } from "drizzle-orm";
import { newPostFormSchema } from "@/validators";
import { userTable } from "@/db/schemas/user";
import { commentTable } from "@/db/schemas/comment";
import { postLikeTable } from "@/db/schemas/like";
import { verifyAuth } from "@hono/auth-js";

const app = new Hono()
  .get("/", verifyAuth(), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const getIsLikedByCurUser = db
        .select()
        .from(postLikeTable)
        .where(and(eq(postLikeTable.userId, curUserId), eq(postLikeTable.postId, postTable.id)));

      const data = await db
        .select({
          id: postTable.id,
          content: postTable.content,
          image: postTable.image,
          createdAt: postTable.createdAt,
          tags: sql<z.infer<typeof tagSchema>[] | null | [null]>`(json_agg(${tagTable}))`,
          userId: postTable.userId,
          user: userTable.name,
          username: userTable.userName,
          isLiked: exists(getIsLikedByCurUser),
          userImage: userTable.image,
          commentCount: count(commentTable.id).as("comment_count"),
          likeCount: count(postLikeTable.id).as("like_count"),
        })
        .from(postTable)
        .innerJoin(userTable, eq(postTable.userId, userTable.id))
        .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
        .leftJoin(tagTable, eq(tagTable.id, postToTagTable.tagId))
        .leftJoin(postLikeTable, eq(postTable.id, postLikeTable.postId))
        .leftJoin(commentTable, eq(postTable.id, commentTable.postId))

        .groupBy(postTable.id, userTable.id, userTable.name, userTable.userName, userTable.image)
        // algorism to order the posts
        .orderBy(eq(userTable.id, postTable.userId), desc(sql`${count(postLikeTable)}+ ${count(commentTable)}`), desc(postTable.createdAt))
        .then((posts) => posts.map((post) => ({ ...post, tags: (post.tags ?? []).filter((tag) => tag !== null) })));

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to get posts", cause: error?.message }, 400);
    }
  })
  .get("/user/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), async (c) => {
    const auth = c.get("authUser");
    const curUserId = auth.session.user?.id as string;

    const { id: userId } = c.req.valid("param");

    try {
      const getIsLikedByCurUser = db
        .select()
        .from(postLikeTable)
        .where(and(eq(postLikeTable.userId, curUserId), eq(postLikeTable.postId, postTable.id)));

      const data = await db
        .select({
          id: postTable.id,
          content: postTable.content,
          image: postTable.image,
          createdAt: postTable.createdAt,
          tags: sql<z.infer<typeof tagSchema>[] | null | [null]>`(json_agg(${tagTable}))`,
          userId: postTable.userId,
          user: userTable.name,
          username: userTable.userName,
          isLiked: exists(getIsLikedByCurUser),
          userImage: userTable.image,
          commentCount: sql<number>`count(${commentTable.id})`.mapWith(Number).as("comment_count"),
          likeCount: sql<number>`count(${postLikeTable.id})`.mapWith(Number).as("like_count"),
        })
        .from(postTable)
        .where(eq(postTable.userId, userId))
        .innerJoin(userTable, eq(postTable.userId, userTable.id))
        .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
        .leftJoin(tagTable, eq(tagTable.id, postToTagTable.tagId))
        .leftJoin(postLikeTable, eq(postTable.id, postLikeTable.postId))
        .leftJoin(commentTable, eq(postTable.id, commentTable.postId))

        .groupBy(postTable.id, userTable.id, userTable.name, userTable.userName, userTable.image)
        .orderBy(desc(postTable.createdAt))
        .then((posts) => posts.map((post) => ({ ...post, tags: (post.tags ?? []).filter((tag) => tag !== null) })));

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to get posts", cause: error?.message }, 400);
    }
  })
  .post("/", verifyAuth(), zValidator("json", newPostFormSchema), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;
      const values = c.req.valid("json");

      const data = await db
        .insert(postTable)
        .values({ ...values, userId: curUserId })
        .returning({ id: postTable.id, content: postTable.content })
        .then((table) => table[0]);

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to add new post", cause: error?.message }, 400);
    }
  })
  .get("/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const { id: postId } = c.req.valid("param");
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const [isLiked] = await db
        .select()
        .from(postLikeTable)
        .where(and(eq(postLikeTable.userId, curUserId), eq(postLikeTable.postId, postId)));
      const [comments] = await db.select({ count: count() }).from(commentTable).where(eq(commentTable.postId, postId));
      const [likes] = await db.select({ count: count() }).from(postLikeTable).where(eq(postLikeTable.postId, postId));

      const data = await db
        .select({
          id: postTable.id,
          content: postTable.content,
          image: postTable.image,
          createdAt: postTable.createdAt,
          tags: sql<z.infer<typeof tagSchema>[] | null | [null]>`(json_agg(${tagTable}))`,
          userId: postTable.userId,
          user: userTable.name,
          username: userTable.userName,
          userImage: userTable.image,
        })
        .from(postTable)
        .where(eq(postTable.id, postId))
        .innerJoin(userTable, eq(postTable.userId, userTable.id))
        .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
        .leftJoin(tagTable, eq(tagTable.id, postToTagTable.tagId))

        .groupBy(postTable.id, userTable.id, userTable.name, userTable.userName, userTable.image)
        .limit(1)
        .then(([post]) => ({ ...post, tags: (post.tags ?? []).filter((tag) => tag !== null) }));

      const post = { ...data, likeCount: likes.count, commentCount: comments.count, isLiked: !!isLiked };

      return c.json({ data: post });
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to get posts", cause: error.message }, 400);
    }
  })
  .delete("/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const { id: postId } = c.req.valid("param");

      await db.delete(postTable).where(and(eq(postTable.id, postId), eq(postTable.userId, curUserId)));

      return c.json({});
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  });

export default app;
