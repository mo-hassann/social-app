import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { postTable } from "./post";

export const commentTable = pgTable("comment", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  postId: uuid("post_id")
    .notNull()
    .references(() => postTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const subCommentTable = pgTable("sub_comment", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  commentId: uuid("comment_id")
    .notNull()
    .references(() => commentTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
