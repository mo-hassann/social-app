import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import db from "@/db";
import { postTable, postToTagTable, tagSchema, tagTable } from "@/db/schemas/post";
import { and, asc, count, desc, eq, exists, isNull, sql, sum } from "drizzle-orm";
import { newCommentFormSchema, newPostFormSchema } from "@/validators";
import { userTable } from "@/db/schemas/user";
import { commentTable, editCommentSchema } from "@/db/schemas/comment";
import { commentLikeTable } from "@/db/schemas/like";
import { verifyAuth } from "@hono/auth-js";
import { format } from "date-fns";

const app = new Hono()
  .get("/", zValidator("query", z.object({ userId: z.string().optional(), postId: z.string() })), async (c) => {
    const { userId, postId } = c.req.valid("query");
    try {
      const curCommentLike = db
        .select()
        .from(commentLikeTable)
        .where(userId ? and(eq(commentLikeTable.userId, userId), eq(commentLikeTable.commentId, commentTable.id)) : isNull(commentLikeTable.userId));

      const data = await db
        .select({
          id: commentTable.id,
          content: commentTable.content,
          createdAt: commentTable.createdAt,
          userId: commentTable.userId,
          user: userTable.name,
          username: userTable.userName,
          isLiked: exists(curCommentLike),
          userImage: userTable.image,
          parentCommentId: commentTable.parentCommentId,
          likeCount: commentTable.likeCount,
        })
        .from(commentTable)
        .where(eq(commentTable.postId, postId))
        .innerJoin(userTable, eq(commentTable.userId, userTable.id))

        .groupBy(commentTable.id, userTable.id, userTable.name, userTable.userName, userTable.image)
        // algorism to order the comments
        .orderBy(asc(commentTable.likeCount), asc(commentTable.createdAt));

      type dataT = ((typeof data)[0] & { children: typeof data; level: number })[];

      /* 
        the prepense of this logic below is to format the comments to be in a tree where a comment can have a children and the children can have 
        also children comments and so on
      */

      // format the comments to tree
      const createTree = (elements: dataT, level: number): dataT => {
        return elements.map((parent) => {
          const children = commentsData.filter((comment) => comment.parentCommentId === parent.id);
          const childrenTree = createTree(children, level + 1);
          return { ...parent, level, children: childrenTree };
        });
      };

      const commentsData = data.map((comment) => ({ ...comment, level: 0, children: [] }));
      // get the parent comments
      const parents = commentsData.filter((comment) => comment.parentCommentId === null);
      // create tree from the parent
      const formattedData = createTree(parents, 1);

      return c.json({ data: formattedData });
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to get posts", cause: error?.message }, 400);
    }
  })
  .get("/:id/to-edit", zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const { id: commentId } = c.req.valid("param");

      const [data] = await db
        .select({
          id: commentTable.id,
          content: commentTable.content,
        })
        .from(commentTable)
        .where(eq(commentTable.id, commentId));

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to get posts", cause: error.message }, 400);
    }
  })
  .post("/", zValidator("json", newCommentFormSchema.and(z.object({ userId: z.string(), postId: z.string(), parentCommentId: z.string().nullable() }))), async (c) => {
    try {
      const values = c.req.valid("json");

      await db.insert(commentTable).values(values);

      await db
        .update(postTable)
        .set({ commentCount: sql`${postTable.commentCount} + 1` })
        .where(eq(postTable.id, values.postId));

      return c.json({});
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to add new post", cause: error?.message }, 400);
    }
  })
  .patch("/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), zValidator("json", editCommentSchema), async (c) => {
    try {
      const { id: commentId } = c.req.valid("param");
      const values = c.req.valid("json");
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const updatedAt = new Date().toISOString();

      const [data] = await db
        .update(commentTable)
        .set({ ...values, updatedAt })
        .where((eq(commentTable.id, commentId), eq(commentTable.userId, curUserId)))
        .returning({ commentId: commentTable.id, postId: commentTable.postId });

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  })
  .delete("/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const { id: commentId } = c.req.valid("param");

      const [deletedComment] = await db
        .delete(commentTable)
        .where(and(eq(commentTable.id, commentId), eq(commentTable.userId, curUserId)))
        .returning({ id: commentTable.id, postId: commentTable.postId, commentCount: postTable.commentCount });

      await db
        .update(postTable)
        .set({ commentCount: sql`${postTable.commentCount} - 1` })
        .where(eq(postTable.id, deletedComment.postId));

      return c.json({ data: deletedComment });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  });

export default app;
