import { foreignKey, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { postTable } from "./post";
import { createSelectSchema } from "drizzle-zod";

export const commentTable = pgTable(
  "comment",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => postTable.id, { onDelete: "cascade" }),
    parentCommentId: uuid("parent_comment_id"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (comment) => ({
    parentRef: foreignKey({
      columns: [comment.parentCommentId],
      foreignColumns: [comment.id],
    }).onDelete("cascade"),
  })
);

// db tables schemas
export const commentSchema = createSelectSchema(commentTable);
