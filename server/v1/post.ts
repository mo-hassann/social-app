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

const app = new Hono()
  .get("/", zValidator("query", z.object({ userId: z.string().optional() })), async (c) => {
    const { userId } = c.req.valid("query");
    try {
      const curPostLike = db
        .select()
        .from(postLikeTable)
        .where(userId ? and(eq(postLikeTable.userId, userId), eq(postLikeTable.postId, postTable.id)) : isNull(postLikeTable.userId));

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
          isLiked: exists(curPostLike),
          userImage: userTable.image,
          commentCount: sql<number>`count(${commentTable.id})`,
          likeCount: sql<number>`count(${postLikeTable.id})`,
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
  .get("/user-posts", zValidator("query", z.object({ userId: z.string() })), async (c) => {
    const { userId } = c.req.valid("query");
    try {
      const curPostLike = db
        .select()
        .from(postLikeTable)
        .where(and(eq(postLikeTable.userId, userId), eq(postLikeTable.postId, postTable.id)));

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
          isLiked: exists(curPostLike),
          userImage: userTable.image,
          commentCount: sql<number>`count(${commentTable.id})`,
          likeCount: sql<number>`count(${postLikeTable.id})`,
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
  .post("/", zValidator("json", newPostFormSchema.and(z.object({ userId: z.string() }))), async (c) => {
    try {
      const values = c.req.valid("json");
      console.log(values, "values post---------------------");

      const data = await db
        .insert(postTable)
        .values(values)
        .returning({ id: postTable.id, content: postTable.content })
        .then((table) => table[0]);

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to add new post", cause: error?.message }, 400);
    }
  })
  .get("/:id", zValidator("query", z.object({ userId: z.string() })), zValidator("param", z.object({ id: z.string() })), async (c) => {
    const { id: postId } = c.req.valid("param");
    const { userId } = c.req.valid("query");
    try {
      const curPostLike = db
        .select()
        .from(postLikeTable)
        .where(and(eq(postLikeTable.userId, userId), eq(postLikeTable.postId, postTable.id)));

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
          isLiked: exists(curPostLike),
          userImage: userTable.image,
          commentCount: sql<number>`count(${commentTable.id})`,
          likeCount: sql<number>`count(${postLikeTable.id})`,
        })
        .from(postTable)
        .where(eq(postTable.id, postId))
        .innerJoin(userTable, eq(postTable.userId, userTable.id))
        .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
        .leftJoin(tagTable, eq(tagTable.id, postToTagTable.tagId))
        .leftJoin(postLikeTable, eq(postTable.id, postLikeTable.postId))
        .leftJoin(commentTable, eq(postTable.id, commentTable.postId))

        .groupBy(postTable.id, userTable.id, userTable.name, userTable.userName, userTable.image)
        .limit(1)
        .then(([post]) => ({ ...post, tags: (post.tags ?? []).filter((tag) => tag !== null) }));

      console.log(data, "-----------data");

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to get posts", cause: error?.message }, 400);
    }
  });

export default app;
