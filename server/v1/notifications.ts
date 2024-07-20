import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import db from "@/db";
import { notificationTable } from "@/db/schemas/notification";
import { and, desc, eq, exists } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { userTable } from "@/db/schemas/user";

const app = new Hono()
  .get("/", verifyAuth(), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const data = await db
        .select({
          id: notificationTable.id,
          userName: userTable.userName,
          userId: notificationTable.userId,
          notificationName: notificationTable.notificationName,
          postId: notificationTable.postId,
          commentId: notificationTable.commentId,
          isRead: notificationTable.isRead,
        })
        .from(notificationTable)
        .leftJoin(userTable, eq(notificationTable.userId, userTable.id))
        .where(eq(notificationTable.toUserId, curUserId))
        .orderBy(desc(notificationTable.createdAt));

      return c.json({ data });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  })
  .get("/is-new-notification", verifyAuth(), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const [oneNotificationUnread] = await db
        .select({ id: notificationTable.id })
        .from(notificationTable)
        .where(and(eq(notificationTable.isRead, false), eq(notificationTable.toUserId, curUserId)))
        .limit(1);

      const isNewNotification = oneNotificationUnread ? true : false;

      return c.json({ data: isNewNotification });
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  })
  .post("/set-is-read/:id", verifyAuth(), zValidator("param", z.object({ id: z.string() })), async (c) => {
    try {
      const auth = c.get("authUser");
      const curUserId = auth.session.user?.id as string;

      const { id } = c.req.valid("param");

      await db
        .update(notificationTable)
        .set({
          isRead: true,
        })
        .where(and(eq(notificationTable.id, id), eq(notificationTable.toUserId, curUserId)));

      return c.json({});
    } catch (error: any) {
      return c.json({ message: "something went wrong", cause: error.message }, 400);
    }
  });

export default app;
