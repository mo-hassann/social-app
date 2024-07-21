import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import db from "@/db";
import { postTable, postToTagTable, tagSchema, tagTable, editPostSchema } from "@/db/schemas/post";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { newPostFormSchema } from "@/validators";
import { followingTable, userTable } from "@/db/schemas/user";

import { postLikeTable } from "@/db/schemas/like";
import { verifyAuth } from "@hono/auth-js";

import { notificationInsertSchema, notificationTable } from "@/db/schemas/notification";

const app = new Hono()
  .get("/", verifyAuth(), zValidator("query", z.object({ searchQuery: z.string().optional().default("") })), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;
      const { searchQuery } = c.req.valid("query");

      const data = await db
        .select({
          id: postTable.id,
          content: postTable.content,
          image: postTable.image,
          createdAt: postTable.createdAt,
          userId: postTable.userId,
          user: userTable.name,
          username: userTable.userName,
          isLiked: eq(postLikeTable.userId, curUserId),
          userImage: userTable.image,
          commentCount: postTable.commentCount,
          likeCount: postTable.likeCount,
        })
        .from(postTable)
        .innerJoin(userTable, eq(postTable.userId, userTable.id))
        .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
        .leftJoin(postLikeTable, and(eq(postLikeTable.postId, postTable.id), eq(postLikeTable.userId, curUserId)))
        .where(sql`(${postTable.content} ~ ${searchQuery})`)
        .groupBy(postTable.id, userTable.id, userTable.name, userTable.userName, userTable.image, postLikeTable.userId)
        // algorism to order the posts
        .orderBy(eq(userTable.id, postTable.userId), desc(sql`${postTable.likeCount} + ${postTable.commentCount}`), desc(postTable.createdAt));

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
      const data = await db
        .select({
          id: postTable.id,
          content: postTable.content,
          image: postTable.image,
          createdAt: postTable.createdAt,
          userId: postTable.userId,
          user: userTable.name,
          username: userTable.userName,
          isLiked: eq(postLikeTable.userId, curUserId),
          userImage: userTable.image,
          commentCount: postTable.commentCount,
          likeCount: postTable.likeCount,
        })
        .from(postTable)
        .where(eq(postTable.userId, userId))
        .innerJoin(userTable, eq(postTable.userId, userTable.id))
        .leftJoin(postToTagTable, eq(postTable.id, postToTagTable.postId))
        .leftJoin(postLikeTable, and(eq(postLikeTable.postId, postTable.id), eq(postLikeTable.userId, curUserId)))
        .groupBy(postTable.id, userTable.id, userTable.name, userTable.userName, userTable.image, postLikeTable.userId)
        .orderBy(desc(postTable.createdAt));

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

      const [data] = await db
        .insert(postTable)
        .values({ ...values, userId: curUserId })
        .returning({ id: postTable.id, userId: postTable.userId });

      // get the hashtags array
      const hashtagsArray = values.content.split(/#(\w+)/g).filter((_, i) => i % 2 === 1);

      if (hashtagsArray.length > 0) {
        // insert the hashtags
        const tags = await db
          .insert(tagTable)
          .values(hashtagsArray.map((tag) => ({ name: tag })))
          .returning({ id: tagTable.id });

        // connect the hashtags with the current post
        await db.insert(postToTagTable).values(tags.map((tag) => ({ postId: data.id, tagId: tag.id })));
      }
      // send notification to all the followers
      const curUserFollowers = await db.select({ id: followingTable.followedBy }).from(followingTable).where(eq(followingTable.userId, curUserId));

      if (curUserFollowers.length > 0) {
        type notificationT = z.infer<typeof notificationInsertSchema>;
        const notifications: notificationT[] = curUserFollowers.map(({ id }) => ({ userId: curUserId, toUserId: id, postId: data.id, notificationName: "NEW_POST" }));

        await db.insert(notificationTable).values(notifications);
      }

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

      const [data] = await db
        .select({
          id: postTable.id,
          content: postTable.content,
          image: postTable.image,
          createdAt: postTable.createdAt,
          userId: postTable.userId,
          user: userTable.name,
          username: userTable.userName,
          userImage: userTable.image,
          commentCount: postTable.commentCount,
          isLiked: eq(postLikeTable.userId, curUserId),
          likeCount: postTable.likeCount,
        })
        .from(postTable)
        .where(eq(postTable.id, postId))
        .innerJoin(userTable, eq(postTable.userId, userTable.id))
.leftJoin(postLikeTable, and(eq(postLikeTable.postId, postTable.id), eq(postLikeTable.userId, curUserId)))

        .groupBy(postTable.id, userTable.id, userTable.name, userTable.userName, userTable.image, postLikeTable.userId)
        .limit(1);

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

      const [data] = await db
        .update(postTable)
        .set({ ...values, updatedAt })
        .where(and(eq(postTable.id, postId), eq(postTable.userId, curUserId)))
        .returning({ postId: postTable.id, userId: postTable.userId });

      // delete all the hashtags
      const tagsToDelete = db.$with("tags_to_delete").as(db.select({ id: tagTable.id }).from(tagTable).leftJoin(postToTagTable, eq(tagTable.id, postToTagTable.tagId)).where(eq(postToTagTable.postId, data.postId)));
      await db
        .with(tagsToDelete)
        .delete(tagTable)
        .where(inArray(tagTable.id, sql`(select * from ${tagsToDelete})`));

      // get hashtags from the post
      const hashtagsArray = values.content.split(/#(\w+)/g).filter((_, i) => i % 2 === 1);

      if (hashtagsArray.length > 0) {
        // insert the hashtags
        const tags = await db
          .insert(tagTable)
          .values(hashtagsArray.map((tag) => ({ name: tag })))
          .returning({ id: tagTable.id });

        // connect the hashtags with the current post
        await db.insert(postToTagTable).values(tags.map((tag) => ({ postId: data.postId, tagId: tag.id })));
      }

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
