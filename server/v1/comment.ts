import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import db from "@/db";
import { postTable, postToTagTable, tagSchema, tagTable } from "@/db/schemas/post";
import { and, asc, count, desc, eq, exists, sql, sum } from "drizzle-orm";
import { newCommentFormSchema, newPostFormSchema } from "@/validators";
import { userTable } from "@/db/schemas/user";
import { commentTable } from "@/db/schemas/comment";
import { commentLikeTable } from "@/db/schemas/like";

const app = new Hono()
  .get("/", zValidator("query", z.object({ userId: z.string(), postId: z.string() })), async (c) => {
    const { userId, postId } = c.req.valid("query");
    try {
      const curCommentLike = db
        .select()
        .from(commentLikeTable)
        .where(and(eq(commentLikeTable.userId, userId), eq(commentLikeTable.commentId, commentTable.id)));

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

      type dataT = typeof data & { children?: typeof data; level?: number }[];

      // format the comments to tree
      const parents = data.filter((comment) => comment.parentCommentId === null);
      const createTree = (elements: dataT, level: number): dataT => {
        return elements.map((parent) => {
          level++;
          const children = data.filter((comment) => comment.parentCommentId === parent.id);
          const childrenTree = createTree(children, level);
          return { ...parent, level, children: childrenTree };
        });
      };

      const formattedData = createTree(parents, 0);

      return c.json({ data: formattedData });
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to get posts", cause: error?.message }, 400);
    }
  })
  .post("/", zValidator("json", newCommentFormSchema.and(z.object({ userId: z.string(), postId: z.string() }))), async (c) => {
    try {
      const values = c.req.valid("json");

      await db.insert(commentTable).values(values);

      return c.json({});
    } catch (error: any) {
      return c.json({ message: "something wrong when trying to add new post", cause: error?.message }, 400);
    }
  })
  .get("/test", zValidator("query", z.object({ userId: z.string(), postId: z.string() })), async (c) => {
    const { userId, postId } = c.req.valid("query");
    const curCommentLike = db
      .select()
      .from(commentLikeTable)
      .where(and(eq(commentLikeTable.userId, userId), eq(commentLikeTable.commentId, commentTable.id)));
    /* 
             is_liked ${exists(curCommentLike)},
            like_count count(${commentLikeTable.id}),
       is_liked ${exists(curCommentLike)},
            like_count count(${commentLikeTable.id}),
      */

    const res = await db.execute(sql`
         WITH RECURSIVE comment_tree AS (
    SELECT 
      comment.id, comment.content, comment.user_id, comment.post_id, comment.parent_comment_id, comment.created_at, comment.updated_at,
      --user.name AS username,
      --post.content AS post_content,
      1 AS level
    FROM comment
    --JOIN user ON comment.user_id = user.id
    --JOIN post ON comment.post_id = post.id
    WHERE comment.parent_comment_id IS NULL
    
    UNION ALL
    
    SELECT 
      comment.id, comment.content, comment.user_id, comment.post_id, comment.parent_comment_id, comment.created_at, comment.updated_at,
      --user.name AS username,
      --post.content AS post_content,
      comment_tree.level + 1
    FROM comment
    --JOIN user ON comment.user_id = user.id
    --JOIN post ON comment.post_id = post.id
    JOIN comment_tree ON comment.parent_comment_id = comment_tree.id
  )
      SELECT * FROM comment_tree
      ORDER BY level, created_at
    `);

    const data = res.rows;

    return c.json({ data });
  });

export default app;
