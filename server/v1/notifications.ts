import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import db from "@/db";
import { notificationTable } from "@/db/schemas/notification";
import { desc, eq } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { userTable } from "@/db/schemas/user";

const app = new Hono().get("/", verifyAuth(), async (c) => {
  try {
    const auth = c.get("authUser");
    const curUserId = auth.session.user?.id as string;

    const data = await db
      .select({
        id: notificationTable.id,
        userName: userTable.name,
        userId: notificationTable.userId,
        notificationName: notificationTable.notificationName,
        postId: notificationTable.postId,
        commentId: notificationTable.commentId,
        postLikeId: notificationTable.postLikeId,
        commentLikeId: notificationTable.commentLikeId,
      })
      .from(notificationTable)
      .leftJoin(userTable, eq(notificationTable.userId, userTable.id))
      .where(eq(notificationTable.toUserId, curUserId))
      .orderBy(desc(notificationTable.createdAt))
      .limit(10);

    return c.json({ data });
  } catch (error: any) {
    return c.json({ message: "something went wrong", cause: error.message }, 400);
  }
});

export default app;
