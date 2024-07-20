import { boolean, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { postTable } from "./post";
import { commentTable } from "./comment";
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
  isRead: boolean("is_read").notNull().default(false),

  postId: uuid("post_id").references(() => postTable.id),
  commentId: uuid("comment_id").references(() => commentTable.id),

  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
});

// db tables schemas
export const notificationInsertSchema = createInsertSchema(notificationTable);
export const notificationSelectSchema = createSelectSchema(notificationTable);
