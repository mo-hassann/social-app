import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import db from "@/db";
import { postTable, postToTagTable, tagSchema, tagTable, editPostSchema } from "@/db/schemas/post";
import { and, count, desc, eq, exists, isNotNull, isNull, sql, sum } from "drizzle-orm";
import { newPostFormSchema } from "@/validators";
import { userTable } from "@/db/schemas/user";
import { commentTable } from "@/db/schemas/comment";
import { postLikeTable } from "@/db/schemas/like";
import { verifyAuth } from "@hono/auth-js";
import { format } from "date-fns";

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
          commentCount: postTable.commentCount,
          likeCount: postTable.likeCount,
        })
        .from(postTable)
        .innerJoin(userTable, eq(postTable.userId, userTable.id))
        .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
        .leftJoin(postLikeTable, eq(postLikeTable.postId, postTable.id))
        .leftJoin(tagTable, eq(tagTable.id, postToTagTable.tagId))

        .groupBy(postTable.id, userTable.id, userTable.name, userTable.userName, userTable.image)
        // algorism to order the posts
        .orderBy(eq(userTable.id, postTable.userId), desc(sql`${postTable.likeCount} + ${postTable.commentCount}`), desc(postTable.createdAt))
        .then((posts) => posts.map((post) => ({ ...post, tags: (post.tags ?? []).filter((tag) => tag !== null) })));

      console.log(data, "data post -------------");
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
          commentCount: postTable.commentCount,
          likeCount: postTable.likeCount,
        })
        .from(postTable)
        .where(eq(postTable.userId, userId))
        .innerJoin(userTable, eq(postTable.userId, userTable.id))
        .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
        .leftJoin(postLikeTable, eq(postLikeTable.postId, postTable.id))
        .leftJoin(tagTable, eq(tagTable.id, postToTagTable.tagId))

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
          commentCount: postTable.commentCount,
          isLiked: sql`(${postLikeTable.userId} = ${curUserId})`,
          likeCount: postTable.likeCount,
        })
        .from(postTable)
        .where(eq(postTable.id, postId))
        .innerJoin(userTable, eq(postTable.userId, userTable.id))
        .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
        .leftJoin(postLikeTable, eq(postLikeTable.postId, postTable.id))
        .leftJoin(tagTable, eq(tagTable.id, postToTagTable.tagId))

        .groupBy(postTable.id, userTable.id, userTable.name, userTable.userName, userTable.image, postLikeTable.userId)
        .limit(1)
        .then(([post]) => ({ ...post, tags: (post.tags ?? []).filter((tag) => tag !== null) }));

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to get posts", cause: error.message }, 400);
    }
  })
  .get("/:id/to-edit", zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const { id: postId } = c.req.valid("param");

      const [data] = await db
        .select({
          id: postTable.id,
          content: postTable.content,
          image: postTable.image,
        })
        .from(postTable)
        .where(eq(postTable.id, postId));

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to get posts", cause: error.message }, 400);
    }
  })
  .patch("/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), zValidator("json", editPostSchema), async (c) => {
    try {
      const { id: postId } = c.req.valid("param");
      const values = c.req.valid("json");
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const updatedAt = new Date().toISOString();

      const data = await db
        .update(postTable)
        .set({ ...values, updatedAt })
        .where((eq(postTable.id, postId), eq(postTable.userId, curUserId)))
        .returning({ postId: postTable.id })
        .then((table) => table[0]);

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
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
