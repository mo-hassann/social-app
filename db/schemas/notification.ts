import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { followingTable, userTable } from "./user";
import { postTable } from "./post";
import { commentTable } from "./comment";
import { commentLikeTable, postLikeTable } from "./like";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const notificationEnum = pgEnum("notification_enum", ["NEW_POST", "NEW_COMMENT", "NEW_POST_LIKE", "NEW_COMMENT_LIKE", "NEW_FOLLOWER"]);

export const notificationTable = pgTable("notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  toUserId: uuid("to_user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  notificationName: notificationEnum("notification_name").notNull(),

  postId: uuid("post_id").references(() => postTable.id),
  commentId: uuid("comment_id").references(() => commentTable.id),
  postLikeId: uuid("post_like_id").references(() => postLikeTable.id),
  commentLikeId: uuid("comment_like_id").references(() => commentLikeTable.id),

  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
});

// db tables schemas
export const notificationInsertSchema = createInsertSchema(notificationTable);
export const notificationSelectSchema = createSelectSchema(notificationTable);
