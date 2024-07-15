import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import db from "@/db";
import { postTable, postToTagTable, tagSchema, tagTable } from "@/db/schemas/post";
import { and, asc, count, desc, eq, exists, isNull, sql, sum } from "drizzle-orm";
import { newCommentFormSchema, newPostFormSchema } from "@/validators";
import { userTable } from "@/db/schemas/user";
import { commentTable } from "@/db/schemas/comment";
import { commentLikeTable } from "@/db/schemas/like";
import { verifyAuth } from "@hono/auth-js";

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
          likeCount: sql<number>`count(${commentLikeTable.id})`,
        })
        .from(commentTable)
        .where(eq(commentTable.postId, postId))
        .innerJoin(userTable, eq(commentTable.userId, userTable.id))
        .leftJoin(commentLikeTable, eq(commentTable.id, commentLikeTable.commentId))

        .groupBy(commentTable.id, userTable.id, userTable.name, userTable.userName, userTable.image)
        // algorism to order the posts
        .orderBy(asc(sql`${count(commentLikeTable)}`), asc(commentTable.createdAt));

      type dataT = ((typeof data)[0] & { children: typeof data; level: number })[];

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
  .post("/", zValidator("json", newCommentFormSchema.and(z.object({ userId: z.string(), postId: z.string(), parentCommentId: z.string().nullable() }))), async (c) => {
    try {
      const values = c.req.valid("json");

      await db.insert(commentTable).values(values);

      return c.json({});
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to add new post", cause: error?.message }, 400);
    }
  })
  .delete("/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const { id: commentId } = c.req.valid("param");

      const [data] = await db
        .delete(commentTable)
        .where(and(eq(commentTable.id, commentId), eq(commentTable.userId, curUserId)))
        .returning({ id: commentTable.id, postId: commentTable.postId });

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  });

export default app;
