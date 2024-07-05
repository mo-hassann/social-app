import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { postTable } from "./post";
import { commentTable } from "./comment";

export const postLikeTable = pgTable(
  "post_like",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => postTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueUsePost: unique("unique_user_post").on(table.postId, table.userId),
  })
);

export const commentLikeTable = pgTable(
  "comment_like",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id")
      .notNull()
      .references(() => commentTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueUserComment: unique("unique_user_comment").on(table.commentId, table.userId),
  })
);
