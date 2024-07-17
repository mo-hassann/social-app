import { foreignKey, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { postTable } from "./post";
import { createSelectSchema } from "drizzle-zod";

export const commentTable = pgTable(
  "comment",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    likeCount: integer("like_count").notNull().default(0),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => postTable.id, { onDelete: "cascade" }),
    parentCommentId: uuid("parent_comment_id"),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow(),
  },
  (comment) => ({
    parentRef: foreignKey({
      columns: [comment.parentCommentId],
      foreignColumns: [comment.id],
    }).onDelete("cascade"),
  })
);

// db tables schemas
export const commentSelectSchema = createSelectSchema(commentTable);
export const commentInsertSchema = createSelectSchema(commentTable);

export const editCommentSchema = commentInsertSchema.pick({ content: true });
